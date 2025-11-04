import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import colors from "../theme/colors";

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isSelected?: boolean;
}

export default function OptionButton({ label, onPress, disabled, isSelected }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && { backgroundColor: colors.accent },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  text: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
});
