import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { IconContainer, IconWrap, IconLabel } from "./TabIcon.styles";

type TabIconProps = {
  focused: boolean;
  color: string;
  iconFocused: keyof typeof Ionicons.glyphMap;
  iconUnfocused: keyof typeof Ionicons.glyphMap;
  label: string;
};

export default function TabIcon({
  focused,
  color,
  iconFocused,
  iconUnfocused,
  label,
}: TabIconProps) {
  return (
    <IconContainer>
      <IconWrap focused={focused}>
        <Ionicons
          name={focused ? iconFocused : iconUnfocused}
          size={22}
          color={color}
        />
      </IconWrap>
      <IconLabel color={color} numberOfLines={1}>
        {label}
      </IconLabel>
    </IconContainer>
  );
}
