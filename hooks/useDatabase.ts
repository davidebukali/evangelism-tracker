import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

export interface DatabaseContact {
  id?: number;
  device_contact_id: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  notes: string;
}

export default function useDatabase() {
  const db = useSQLiteContext();

  const addContact = useCallback(
    async (contact: DatabaseContact) => {
      try {
        const result = await db.runAsync(
          `INSERT INTO contacts (device_contact_id, first_name, last_name, phone, notes) VALUES (?, ?, ?, ?, ?)`,
          [
            contact.device_contact_id,
            contact.first_name,
            contact.last_name,
            contact.phone,
            contact.notes,
          ]
        );
        return result.lastInsertRowId;
      } catch (error) {
        console.error('Error adding contact to db:', error);
        throw error;
      }
    },
    [db]
  );

  const getContacts = useCallback(
    async (limit: number = -1, offset: number = 0) => {
      try {
        const allRows = await db.getAllAsync<DatabaseContact>(
          `SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?`,
          [limit, offset]
        );
        return allRows;
      } catch (error) {
        console.error('Error getting contacts from db:', error);
        throw error;
      }
    },
    [db]
  );

  return {
    addContact,
    getContacts,
  };
}
