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
  margin-bottom: 20px;
  color: #0f1117;
`;

export const CountBadge = styled.View`
  background-color: #e9ecef;
  border-radius: 12px;
  padding: 4px 10px;
  align-self: flex-start;
  margin-bottom: 16px;
`;

export const CountText = styled.Text`
  color: #6c757d;
  font-size: 12px;
  font-weight: 600;
`;

export const Card = styled.TouchableOpacity`
  background-color: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CardLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const CardIcon = styled.Text`
  font-size: 28px;
`;

export const CardInfo = styled.View`
  flex: 1;
`;

export const DateText = styled.Text`
  color: #6c757d;
  font-size: 12px;
`;

export const DistanceText = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #007aff;
`;

export const CardRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const PointsText = styled.Text`
  color: #adb5bd;
  font-size: 12px;
`;

export const Chevron = styled.Text`
  color: #adb5bd;
  font-size: 22px;
`;

export const DeleteButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #fee2e2;
  justify-content: center;
  align-items: center;
`;

export const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const EmptyIcon = styled.Text`
  font-size: 48px;
`;

export const EmptyText = styled.Text`
  color: #adb5bd;
  font-size: 16px;
`;

export const DurationText = styled.Text`
  color: #9ca3af;
  font-size: 11px;
  margin-top: 1px;
`;
