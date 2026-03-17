import styled from "styled-components/native";

export const IconContainer = styled.View`
  width: 70px;
  align-items: center;
  justify-content: center;
`;

export const IconWrap = styled.View<{ focused: boolean }>`
  width: 44px;
  height: 36px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background-color: ${({ focused }: { focused: boolean }) =>
    focused ? "rgba(255,107,53,0.1)" : "transparent"};
  border-width: ${({ focused }: { focused: boolean }) => (focused ? 1 : 0)}px;
  border-color: rgba(255, 107, 53, 0.3);
  margin-bottom: 4px;
`;

export const IconLabel = styled.Text<{ color: string }>`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: ${({ color }: { color: string }) => color};
  text-align: center;
`;
