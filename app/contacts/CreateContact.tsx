import { commonStyles, spacing } from '@/assets/styles/theme';
import { FormInput } from '@/components/FormInput';
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

interface CreateContactForm {
  firstName: string;
  lastName: string;
  phone: string;
  notes: string;
}

export default function CreateContact() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<CreateContactForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<CreateContactForm> = async (data) => {
    setIsSubmitting(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status === 'granted') {
        const contact: Contacts.Contact = {
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

        const contactId = await Contacts.addContactAsync(contact);
        
        if (contactId) {
          Alert.alert('Success', 'Contact saved to your device!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        } else {
          Alert.alert('Error', 'Failed to save contact.');
        }
      } else {
        Alert.alert(
          'Permission Denied', 
          'Permission to access contacts is required to save them to your device. Please enable it in your system settings.'
        );
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', 'An unexpected error occurred while saving the contact.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.formContainer}>
        <FormInput
          name="firstName"
          control={control}
          label="First Name"
          rules={{ required: "First name is required" }}
          error={errors.firstName?.message}
          disabled={isSubmitting}
        />

        <FormInput
          name="lastName"
          control={control}
          label="Last Name"
          rules={{ required: "Last name is required" }}
          error={errors.lastName?.message}
          disabled={isSubmitting}
        />

        <FormInput
          name="phone"
          control={control}
          label="Phone"
          rules={{ required: "Phone number is required" }}
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
          {isSubmitting ? 'Saving...' : 'Save Contact'}
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
  button: {
    marginTop: spacing.lg,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
});

