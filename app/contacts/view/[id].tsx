import { buttonStyles, colors, commonStyles, spacing } from '@/assets/styles/theme';
import useDatabase, { DatabaseContact } from '@/hooks/useDatabase';
import * as Contacts from 'expo-contacts';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Divider, List, Text } from 'react-native-paper';

interface ContactDetails {
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  notes: string;
}

function getInitials(contact: ContactDetails) {
  const firstInitial = contact.firstName.trim().charAt(0);
  const lastInitial = contact.lastName.trim().charAt(0);
  const initials = `${firstInitial}${lastInitial}`.trim();
  return initials || contact.name.trim().charAt(0) || '?';
}

function mapDatabaseContact(contact: DatabaseContact): ContactDetails {
  const name = `${contact.first_name} ${contact.last_name ?? ''}`.trim();

  return {
    firstName: contact.first_name,
    lastName: contact.last_name ?? '',
    name,
    phone: contact.phone,
    notes: contact.notes ?? '',
  };
}

export default function ViewContact() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deleteContact, getContactByDeviceId } = useDatabase();
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const contactId = Array.isArray(id) ? id[0] : id;

  useFocusEffect(
    useCallback(() => {
      const loadContact = async () => {
      if (!contactId) {
        setIsLoading(false);
        return;
      }

      try {
        const [deviceContact, databaseContact] = await Promise.all([
          Contacts.getContactByIdAsync(contactId, [
            Contacts.Fields.FirstName,
            Contacts.Fields.LastName,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Note,
          ]),
          getContactByDeviceId(contactId),
        ]);

        if (databaseContact) {
          setContact(mapDatabaseContact(databaseContact));
          return;
        }

        if (deviceContact) {
          setContact({
            firstName: deviceContact.firstName ?? '',
            lastName: deviceContact.lastName ?? '',
            name: deviceContact.name ?? 'Unnamed contact',
            phone: deviceContact.phoneNumbers?.[0]?.number ?? '',
            notes: deviceContact.note ?? '',
          });
          return;
        }

        Alert.alert('Contact not found', 'This contact could not be loaded.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch (error) {
        console.error('Error loading contact:', error);
        Alert.alert('Error', 'Failed to load contact.');
      } finally {
        setIsLoading(false);
      }
    };
      loadContact();
    }, [contactId, getContactByDeviceId])
  );

  const initials = useMemo(() => (contact ? getInitials(contact) : ''), [contact]);

  const handleCall = useCallback(async () => {
    if (!contact?.phone) {
      Alert.alert('Phone number missing', 'This contact does not have a phone number.');
      return;
    }

    try {
      await Linking.openURL(`tel:${contact.phone.trim()}`);
    } catch {
      Alert.alert('Unable to call', 'This device cannot open the phone dialer.');
    }
  }, [contact]);

  const handleDelete = useCallback(() => {
    if (!contactId) {
      return;
    }

    Alert.alert(
      'Delete contact',
      'Are you sure you want to delete this contact? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await Contacts.removeContactAsync(contactId);
              await deleteContact(contactId);
              router.back();
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'Failed to delete contact.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }, [contactId, deleteContact]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!contact) {
    return (
      <View style={[commonStyles.container, styles.emptyContainer]}>
        <Text variant="bodyLarge">Contact could not be loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={commonStyles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profile}>
        <Avatar.Text size={112} label={initials.toUpperCase()} />
        <Text variant="headlineSmall" style={styles.name}>
          {contact.name}
        </Text>
      </View>

      <Divider />

      <View style={styles.details}>
        <List.Item
          title={contact.phone || 'No phone number'}
          description="Mobile"
          left={(props) => <List.Icon {...props} icon="phone-outline" />}
        />
        <List.Item
          title={contact.notes || 'No notes'}
          description="Note"
          left={(props) => <List.Icon {...props} icon="message-text-outline" />}
        />
      </View>

      <Divider />

      <View style={styles.actions}>
        <View style={styles.primaryActions}>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => router.push(`/contacts/edit/${contactId}`)}
            style={buttonStyles.actionButton}
            contentStyle={buttonStyles.actionButtonContent}
          >
            Edit
          </Button>
          <Button
            mode="contained"
            icon="phone"
            disabled={!contact.phone}
            onPress={handleCall}
            style={[buttonStyles.actionButton, styles.callButton]}
            contentStyle={buttonStyles.actionButtonContent}
          >
            Call
          </Button>
        </View>

        <Button
          mode="text"
          icon="delete-outline"
          textColor={colors.error}
          loading={isDeleting}
          disabled={isDeleting}
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          Delete contact
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  name: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  details: {
    paddingVertical: spacing.md,
  },
  actions: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
  },
  primaryActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  callButton: {
    minHeight: 56,
  },
  deleteButton: {
    alignSelf: 'center',
    marginTop: spacing.xxl,
  },
});
