import { colors, commonStyles, spacing } from '@/assets/styles/theme';
import { Stack } from 'expo-router';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

interface CreateContactForm {
  firstName: string;
  lastName: string;
  phone: string;
  notes: string;
}

export default function CreateContact() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<CreateContactForm> = (data) => {
    console.log(data);
  };

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ title: "Add Contact" }} />
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="firstName"
          rules={{ required: "First name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="First Name"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.firstName}
              style={styles.input}
            />
          )}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

        <Controller
          control={control}
          name="lastName"
          rules={{ required: "Last name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Last Name"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          rules={{ required: "Phone number is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Phone"
              mode="outlined"
              keyboardType="phone-pad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Notes"
              mode="outlined"
              multiline
              numberOfLines={8}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />

        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Save Contact
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
  input: {
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: spacing.lg,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -spacing.sm,
    marginLeft: spacing.xs,
  }
});

