import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #0f1117;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 20px 16px;
  gap: 14px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1e2130;
  justify-content: center;
  align-items: center;
`;

export const BackArrow = styled.Text`
  color: white;
  font-size: 20px;
`;

export const HeaderTitles = styled.View`
  flex: 1;
`;

export const HeaderTitle = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: 700;
`;

export const HeaderSub = styled.Text`
  color: #6b7280;
  font-size: 12px;
  margin-top: 2px;
`;

export const MapCard = styled.View`
  margin: 0 16px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #1e2130;
`;

export const Legend = styled.View`
  flex-direction: row;
  gap: 16px;
  padding: 12px 16px;
  background-color: #1e2130;
`;

export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const LegendDot = styled.View<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ color }: { color: string }) => color};
`;

export const LegendText = styled.Text`
  color: #9ca3af;
  font-size: 13px;
`;

export const MarkerStart = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #22c55e;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: white;
`;

export const MarkerEnd = styled.View`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #ef4444;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: white;
`;

export const MarkerText = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 11px;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  gap: 10px;
  padding: 0 16px;
  margin-top: 14px;
`;

export const StatCard = styled.View`
  flex: 1;
  background-color: #1e2130;
  border-radius: 16px;
  padding: 14px;
  align-items: center;
  gap: 4px;
`;

export const StatIcon = styled.Text`
  font-size: 22px;
`;

export const StatValue = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
`;

export const StatLabel = styled.Text`
  color: #6b7280;
  font-size: 11px;
  text-align: center;
`;

export const InfoCard = styled.View`
  margin: 14px 16px 40px;
  background-color: #1e2130;
  border-radius: 16px;
  padding: 18px;
  gap: 12px;
`;

export const InfoTitle = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #2d3148;
  padding-bottom: 10px;
`;

export const InfoKey = styled.Text`
  color: #6b7280;
  font-size: 14px;
`;

export const InfoVal = styled.Text`
  color: #e5e7eb;
  font-size: 14px;
  font-weight: 600;
`;

export const PaceCard = styled.View`
  flex: 1;
  background-color: rgba(255, 107, 53, 0.08);
  border-radius: 16px;
  padding: 14px;
  align-items: center;
  gap: 4px;
  border-width: 1px;
  border-color: rgba(255, 107, 53, 0.25);
`;
