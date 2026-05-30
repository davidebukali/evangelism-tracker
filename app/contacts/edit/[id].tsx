import { commonStyles, spacing } from '@/assets/styles/theme';
import { FormInput } from '@/components/FormInput';
import * as Contacts from 'expo-contacts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';

interface EditContactForm {
  firstName: string;
  lastName: string;
  phone: string;
  notes: string;
}

export default function EditContact() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EditContactForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      notes: '',
    },
  });

  // Fetch contact and pre-fill the form
  useEffect(() => {
    const loadContact = async () => {
      try {
        const contact = await Contacts.getContactByIdAsync(id, [
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Note,
        ]);

        if (contact) {
          reset({
            firstName: contact.firstName ?? '',
            lastName: contact.lastName ?? '',
            phone: contact.phoneNumbers?.[0]?.number ?? '',
            notes: contact.note ?? '',
          });
        } else {
          Alert.alert('Error', 'Contact not found.', [
            { text: 'OK', onPress: () => router.back() },
          ]);
        }
      } catch (error) {
        console.error('Error loading contact:', error);
        Alert.alert('Error', 'Failed to load contact.');
      } finally {
        setIsLoading(false);
      }
    };

    loadContact();
  }, [id]);

  const onSubmit: SubmitHandler<EditContactForm> = async (data) => {
    setIsSubmitting(true);
    try {
      const updatedContact = {
        id,
        contactType: Contacts.ContactTypes.Person,
        name: `${data.firstName} ${data.lastName}`.trim(),
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumbers: [{
          label: 'mobile',
          number: data.phone,
        }],
        note: data.notes,
      };

      await Contacts.updateContactAsync(updatedContact);

      Alert.alert('Success', 'Contact updated!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating contact:', error);
      Alert.alert('Error', 'Failed to update contact.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Contacts.removeContactAsync(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete contact.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.formContainer}>
        <FormInput
          name="firstName"
          control={control}
          label="First Name"
          rules={{ required: 'First name is required' }}
          error={errors.firstName?.message}
          disabled={isSubmitting}
        />

        <FormInput
          name="lastName"
          control={control}
          label="Last Name"
          rules={{ required: 'Last name is required' }}
          error={errors.lastName?.message}
          disabled={isSubmitting}
        />

        <FormInput
          name="phone"
          control={control}
          label="Phone"
          rules={{ required: 'Phone number is required' }}
          error={errors.phone?.message}
          keyboardType="phone-pad"
          disabled={isSubmitting}
        />

        <FormInput
          name="notes"
          control={control}
          label="Notes"
          multiline
          numberOfLines={8}
          disabled={isSubmitting}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  formContainer: {
    gap: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: spacing.lg,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
});