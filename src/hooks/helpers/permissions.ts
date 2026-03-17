import * as Location from "expo-location";

export const checkForegroundPermission = async () => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === "granted";
};

export const requestForegroundPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

export const requestBackgroundPermission = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  return status === "granted";
};
