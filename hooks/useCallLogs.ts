import useDatabase, { DatabaseContact } from '@/hooks/useDatabase';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import type { CallLog } from 'react-native-call-log';

const RECENT_CALL_LIMIT = 500;
const NATIVE_MODULE_MESSAGE =
  'Call log native module is missing. Rebuild the app with: npx expo run:android';

export interface ContactCallLogSummary {
  id: string | number;
  name: string;
  phone: string;
  callCount: number;
  mostRecentTimestamp: number;
  mostRecentDateTime: string;
}

export interface UseCallLogsResponse<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  permissionStatus: CallLogPermissionStatus;
  refetch: () => Promise<void>;
  openPermissionSettings: () => Promise<void>;
}

export type CallLogPermissionStatus =
  | 'unknown'
  | 'granted'
  | 'denied'
  | 'never_ask_again'
  | 'unsupported';

async function requestCallLogPermission(): Promise<CallLogPermissionStatus> {
  if (Platform.OS !== 'android') {
    return 'unsupported';
  }

  const permission = PermissionsAndroid.PERMISSIONS.READ_CALL_LOG;
  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return 'granted';
  }

  const status = await PermissionsAndroid.request(permission, {
    title: 'Call log access',
    message: 'Emmaus uses outgoing call history to show follow-up activity for your saved contacts.',
    buttonPositive: 'Allow',
    buttonNegative: 'Not now',
  });

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return 'granted';
  }

  if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    return 'never_ask_again';
  }

  return 'denied';
}

async function openPermissionSettings() {
  await Linking.openSettings();
}

function callLogPermissionError(status: CallLogPermissionStatus) {
  switch (status) {
    case 'unsupported':
      return 'Call logs are only available on Android';
    case 'never_ask_again':
      return 'Call log permission is disabled. Enable it in Android settings to view call history.';
    default:
      return 'Call log permission is required';
  }
}

function normalizePhoneNumber(phoneNumber?: string | null) {
  return phoneNumber?.replace(/\D/g, '') ?? '';
}

function phoneMatchKeys(phoneNumber?: string | null) {
  const normalized = normalizePhoneNumber(phoneNumber);
  if (!normalized) {
    return [];
  }

  const withoutLeadingZeros = normalized.replace(/^0+/, '');
  const keys = new Set([normalized, withoutLeadingZeros]);

  if (normalized.length > 9) {
    keys.add(normalized.slice(-9));
  }

  return [...keys].filter(Boolean);
}

function isOutgoingCall(log: CallLog) {
  return log.type === 'OUTGOING' || log.type === 'WIFI_OUTGOING';
}

function getTimestamp(log: CallLog) {
  const parsed = Number(log.timestamp);
  return Number.isFinite(parsed) ? parsed : 0;
}

function contactName(contact: DatabaseContact) {
  return `${contact.first_name} ${contact.last_name ?? ''}`.trim();
}

async function getCallLogsModule() {
  return (await import('react-native-call-log')).default;
}

function mapCallLogError(error: unknown) {
  const message = error instanceof Error ? error.message : 'An error occurred loading call logs';

  if (
    message.includes("doesn't seem to be linked") ||
    message.includes('CallLogs') ||
    message.includes('Native module')
  ) {
    return NATIVE_MODULE_MESSAGE;
  }

  return message;
}

export function useCallLogContacts(): UseCallLogsResponse<ContactCallLogSummary> {
  const { getContacts } = useDatabase();
  const isRequestInFlight = useRef(false);
  const [data, setData] = useState<ContactCallLogSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<CallLogPermissionStatus>('unknown');

  const refetch = useCallback(async () => {
    if (isRequestInFlight.current) {
      return;
    }

    isRequestInFlight.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const status = await requestCallLogPermission();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setData([]);
        setError(callLogPermissionError(status));
        return;
      }

      const [CallLogs, contacts] = await Promise.all([
        getCallLogsModule(),
        getContacts(-1, 0),
      ]);

      const contactByPhoneKey = new Map<string, DatabaseContact>();
      contacts.forEach((contact) => {
        phoneMatchKeys(contact.phone).forEach((key) => {
          if (!contactByPhoneKey.has(key)) {
            contactByPhoneKey.set(key, contact);
          }
        });
      });

      const logs = await CallLogs.load(RECENT_CALL_LIMIT, {
        types: ['OUTGOING', 'WIFI_OUTGOING'],
      });

      const summaries = new Map<string, ContactCallLogSummary>();

      logs.filter(isOutgoingCall).forEach((log) => {
        const matchedContact = phoneMatchKeys(log.phoneNumber)
          .map((key) => contactByPhoneKey.get(key))
          .find(Boolean);

        if (!matchedContact) {
          return;
        }

        const id = matchedContact.device_contact_id ?? String(matchedContact.id);
        const timestamp = getTimestamp(log);
        const existing = summaries.get(String(id));

        summaries.set(String(id), {
          id,
          name: contactName(matchedContact),
          phone: matchedContact.phone,
          callCount: (existing?.callCount ?? 0) + 1,
          mostRecentTimestamp: Math.max(existing?.mostRecentTimestamp ?? 0, timestamp),
          mostRecentDateTime:
            timestamp >= (existing?.mostRecentTimestamp ?? 0)
              ? log.dateTime
              : existing?.mostRecentDateTime ?? log.dateTime,
        });
      });

      setData(
        [...summaries.values()].sort(
          (first, second) => second.mostRecentTimestamp - first.mostRecentTimestamp
        )
      );
    } catch (err) {
      setData([]);
      setError(mapCallLogError(err));
    } finally {
      isRequestInFlight.current = false;
      setIsLoading(false);
    }
  }, [getContacts]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    permissionStatus,
    refetch,
    openPermissionSettings,
  };
}

export function useContactCallLogs(
  phoneNumber?: string
): UseCallLogsResponse<CallLog> {
  const isRequestInFlight = useRef(false);
  const [data, setData] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<CallLogPermissionStatus>('unknown');

  const refetch = useCallback(async () => {
    if (isRequestInFlight.current) {
      return;
    }

    if (!phoneNumber) {
      setData([]);
      setError('Phone number is missing');
      return;
    }

    isRequestInFlight.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const status = await requestCallLogPermission();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setData([]);
        setError(callLogPermissionError(status));
        return;
      }

      const CallLogs = await getCallLogsModule();
      const logs = await CallLogs.load(-1, {
        phoneNumbers: phoneNumber,
        types: ['OUTGOING', 'WIFI_OUTGOING'],
      });

      setData(
        logs
          .filter(isOutgoingCall)
          .sort((first, second) => getTimestamp(second) - getTimestamp(first))
      );
    } catch (err) {
      setData([]);
      setError(mapCallLogError(err));
    } finally {
      isRequestInFlight.current = false;
      setIsLoading(false);
    }
  }, [phoneNumber]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    permissionStatus,
    refetch,
    openPermissionSettings,
  };
}
