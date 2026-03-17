import React, { useState } from "react";
import { Alert } from "react-native";
import useStore from "../store/useStore";
import {
  Container,
  Inner,
  Header,
  Section,
  SectionTitle,
  SettingRow,
  SettingLabel,
  SettingSubLabel,
  InputRow,
  StrideLengthInput,
  UnitText,
  SaveButton,
  SaveButtonText,
  PresetRow,
  PresetButton,
  PresetText,
  InfoText,
} from "./SettingsScreen.styles";

const PRESETS = [
  { label: "Short (0.65m)", value: 0.65 },
  { label: "Average (0.76m)", value: 0.762 },
  { label: "Tall (0.85m)", value: 0.85 },
];

export default function SettingsScreen() {
  const strideLength = useStore((state) => state.strideLength);
  const setStrideLength = useStore((state) => state.setStrideLength);
  const activities = useStore((state) => state.activities);

  const [inputValue, setInputValue] = useState(strideLength.toString());

  const handleSave = () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || parsed < 0.3 || parsed > 1.5) {
      Alert.alert(
        "Invalid Value",
        "Please enter a stride length between 0.3m and 1.5m.",
      );
      return;
    }
    setStrideLength(parsed);
    Alert.alert("Saved", `Stride length set to ${parsed.toFixed(3)}m`);
  };

  const handlePreset = (value: number) => {
    setStrideLength(value);
    setInputValue(value.toString());
  };

  return (
    <Container>
      <Inner>
        <Header>Settings</Header>

        <Section>
          <SectionTitle>Stride Length</SectionTitle>
          <SettingRow>
            <SettingLabel>Your stride length</SettingLabel>
          </SettingRow>
          <InfoText>
            Used to estimate steps when the app is in the background. Measure
            yours by walking 10 steps and dividing the distance by 10.
          </InfoText>

          <PresetRow>
            {PRESETS.map((preset) => (
              <PresetButton
                key={preset.value}
                active={Math.abs(strideLength - preset.value) < 0.001}
                onPress={() => handlePreset(preset.value)}
              >
                <PresetText
                  active={Math.abs(strideLength - preset.value) < 0.001}
                >
                  {preset.label}
                </PresetText>
              </PresetButton>
            ))}
          </PresetRow>

          <InputRow>
            <StrideLengthInput
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="decimal-pad"
              placeholder="0.762"
              placeholderTextColor="#adb5bd"
              maxLength={5}
            />
            <UnitText>meters</UnitText>
          </InputRow>

          <SaveButton onPress={handleSave}>
            <SaveButtonText>SAVE STRIDE LENGTH</SaveButtonText>
          </SaveButton>
        </Section>

        <Section>
          <SectionTitle>Statistics</SectionTitle>
          <SettingRow>
            <SettingLabel>Total activities</SettingLabel>
            <SettingLabel>{activities.length}</SettingLabel>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Total distance</SettingLabel>
            <SettingLabel>
              {activities.reduce((sum, a) => sum + a.distance, 0).toFixed(2)} km
            </SettingLabel>
          </SettingRow>
          <SettingRow>
            <SettingLabel>Total steps</SettingLabel>
            <SettingLabel>
              {activities
                .reduce((sum, a) => sum + (a.steps ?? 0), 0)
                .toLocaleString()}
            </SettingLabel>
          </SettingRow>
        </Section>
      </Inner>
    </Container>
  );
}
