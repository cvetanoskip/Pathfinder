import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f8f9fa;
`;

export const Inner = styled.View`
  flex: 1;
  padding: 0 20px;
`;

export const Header = styled.Text`
  font-size: 28px;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 24px;
  color: #0f1117;
`;

export const Section = styled.View`
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  gap: 12px;
`;

export const SectionTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #6c757d;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

export const SettingRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SettingLabel = styled.Text`
  font-size: 16px;
  color: #0f1117;
  font-weight: 500;
`;

export const SettingSubLabel = styled.Text`
  font-size: 12px;
  color: #6c757d;
  margin-top: 2px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const StrideLengthInput = styled.TextInput`
  background-color: #f1f3f5;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 16px;
  font-weight: 600;
  color: #0f1117;
  width: 80px;
  text-align: center;
`;

export const UnitText = styled.Text`
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #ff6b35;
  border-radius: 12px;
  padding: 12px 20px;
  align-items: center;
  margin-top: 8px;
`;

export const SaveButtonText = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
`;

export const PresetRow = styled.View`
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PresetButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 14px;
  border-radius: 20px;
  background-color: ${({ active }: { active: boolean }) =>
    active ? "#FF6B35" : "#f1f3f5"};
  border-width: 1px;
  border-color: ${({ active }: { active: boolean }) =>
    active ? "#FF6B35" : "#e9ecef"};
`;

export const PresetText = styled.Text<{ active: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ active }: { active: boolean }) => (active ? "white" : "#495057")};
`;

export const InfoText = styled.Text`
  font-size: 12px;
  color: #adb5bd;
  line-height: 18px;
`;
