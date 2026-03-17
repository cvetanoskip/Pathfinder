import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #0f1117;
`;

export const Inner = styled.View`
  flex: 1;
`;

export const StatsRow = styled.View`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  flex-direction: row;
  gap: 8px;
`;

export const StatCard = styled.View<{ accent?: boolean }>`
  flex: 1;
  background-color: rgba(15, 17, 23, 0.9);
  border-radius: 16px;
  padding: 12px;
  align-items: center;
  border-width: 1px;
  border-color: #1e2130;
`;

export const StatValue = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 700;
`;

export const StatLabel = styled.Text`
  color: #6b7280;
  font-size: 10px;
  margin-top: 2px;
  letter-spacing: 0.5px;
`;

export const ButtonRow = styled.View`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  align-items: center;
`;

export const StartButton = styled.TouchableOpacity`
  background-color: #ff6b35;
  padding-horizontal: 48px;
  padding-vertical: 16px;
  border-radius: 32px;
`;

export const StopButton = styled.TouchableOpacity`
  background-color: #ef4444;
  padding-horizontal: 48px;
  padding-vertical: 16px;
  border-radius: 32px;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 2px;
`;

export const DeniedContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: #0f1117;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const DeniedIcon = styled.Text`
  font-size: 64px;
  margin-bottom: 24px;
`;

export const DeniedTitle = styled.Text`
  color: white;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
`;

export const DeniedSubtitle = styled.Text`
  color: #6b7280;
  font-size: 15px;
  text-align: center;
  line-height: 22px;
  margin-bottom: 32px;
`;

export const SettingsButton = styled.TouchableOpacity`
  background-color: #ff6b35;
  padding-horizontal: 40px;
  padding-vertical: 14px;
  border-radius: 28px;
`;

export const SettingsButtonText = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 1px;
`;

export const BgLocationBanner = styled.TouchableOpacity`
  position: absolute;
  bottom: 120px;
  left: 16px;
  right: 16px;
  background-color: #1e2130;
  border-radius: 12px;
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  border-width: 1px;
  border-color: rgba(255, 107, 53, 0.3);
`;

export const BgLocationText = styled.Text`
  color: #9ca3af;
  font-size: 12px;
  flex: 1;
  line-height: 18px;
`;
