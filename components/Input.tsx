import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

interface InputProps extends TextInputProps {
  multiline?: boolean;
}

export function Input({ style, multiline, ...props }: InputProps) {
  const { theme } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: theme.backgroundDefault,
          color: theme.text,
          borderColor: theme.backgroundTertiary,
          minHeight: multiline ? 100 : Spacing.inputHeight,
        },
        style,
      ]}
      placeholderTextColor={theme.textSecondary}
      multiline={multiline}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    fontSize: Typography.body.fontSize,
  },
});
