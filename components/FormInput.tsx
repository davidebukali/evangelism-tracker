import { colors, inputStyles, spacing } from '@/assets/styles/theme';
import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface FormInputProps<T extends FieldValues> extends Omit<TextInputProps, 'error'> {
  control: Control<T>;
  name: Path<T>;
  rules?: object;
  error?: string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  rules,
  error,
  label,
  ...props
}: FormInputProps<T>) {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={label}
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!error}
            textColor={colors.textPrimary}
            placeholderTextColor={colors.textSecondary}
            style={inputStyles.textInput}
            {...props}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // spacing is handled by formContainer gap
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
