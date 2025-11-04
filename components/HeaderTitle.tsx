import React from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../theme/colors";

interface Props {
  title: string;
}

export default function HeaderTitle({ title }: Props) {
  return <Text style={styles.text}>{title}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
