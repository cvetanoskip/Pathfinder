import React from "react";
import { Text } from "react-native";

const MockIcon = ({ name, ...props }) => <Text {...props}>{name}</Text>;

export const Ionicons = MockIcon;
export default { Ionicons };
