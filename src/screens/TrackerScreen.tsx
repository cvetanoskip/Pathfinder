import React, { useState, useEffect } from "react";
import { Linking, AppState } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useTracking } from "../hooks/useTracking";
import { useStepCounter } from "../hooks/useStepCounter";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import useStore from "../store/useStore";
import MapViewWithRoute from "../components/MapViewWithRoute";
import { formatDuration, formatPace } from "../utils/formatters";
import {
  Container,
  Inner,
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
  ButtonRow,
  StartButton,
  StopButton,
  ButtonText,
  DeniedContainer,
  DeniedIcon,
  DeniedTitle,
  DeniedSubtitle,
  SettingsButton,
  SettingsButtonText,
  BgLocationBanner,
  BgLocationText,
} from "./TrackerScreen.styles";

export default function TrackerScreen() {
  const {
    location,
    route,
    distance,
    duration,
    pace,
    isTracking,
    startTracking,
    stopTracking,
    permissionStatus,
  } = useTracking();

  const steps = useStepCounter(isTracking, distance);
  const addActivity = useStore((state) => state.addActivity);
  const [bgPermission, setBgPermission] = useState<string>("unknown");

  useEffect(() => {
    Location.getBackgroundPermissionsAsync()
      .then(({ status }) => setBgPermission(status))
      .catch(() => setBgPermission("denied"));
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        try {
          const { status } = await Location.getBackgroundPermissionsAsync();
          setBgPermission(status);
        } catch {
          setBgPermission("denied");
        }
      }
    });
    return () => sub.remove();
  }, []);

  const handleStopAndSave = async () => {
    await stopTracking();
    if (route.length > 0) {
      addActivity({
        date: new Date().toISOString(),
        distance,
        duration,
        pace,
        steps,
        coordinates: route,
      });
      alert("Activity Saved!");
    }
  };

  if (permissionStatus === "denied") {
    return (
      <DeniedContainer>
        <DeniedIcon>📍</DeniedIcon>
        <DeniedTitle>Location Access Required</DeniedTitle>
        <DeniedSubtitle>
          PathFinder needs access to your location to track your routes and show
          you on the map. Please enable it in your device settings.
        </DeniedSubtitle>
        <SettingsButton onPress={() => Linking.openSettings()}>
          <SettingsButtonText>OPEN SETTINGS</SettingsButtonText>
        </SettingsButton>
      </DeniedContainer>
    );
  }

  return (
    <Container>
      <Inner>
        <MapViewWithRoute
          route={route}
          currentLocation={location}
          isTracking={isTracking}
        />

        <StatsRow>
          <StatCard>
            <StatValue>{distance.toFixed(2)}</StatValue>
            <StatLabel>km</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatDuration(duration)}</StatValue>
            <StatLabel>duration</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{formatPace(pace)}</StatValue>
            <StatLabel>min/km</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{steps}</StatValue>
            <StatLabel>steps</StatLabel>
          </StatCard>
        </StatsRow>

        {bgPermission !== "granted" && (
          <BgLocationBanner onPress={() => Linking.openSettings()}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#FF6B35"
            />
            <BgLocationText>
              Enable "Allow all the time" in Settings for background tracking.
            </BgLocationText>
            <Ionicons name="chevron-forward" size={14} color="#4B5563" />
          </BgLocationBanner>
        )}

        <ButtonRow>
          {!isTracking ? (
            <StartButton
              onPress={startTracking}
              style={{
                elevation: 8,
                shadowColor: "#FF6B35",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
              }}
            >
              <ButtonText>▶ START TRACKING</ButtonText>
            </StartButton>
          ) : (
            <StopButton
              onPress={handleStopAndSave}
              style={{
                elevation: 8,
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
              }}
            >
              <ButtonText>■ STOP & SAVE</ButtonText>
            </StopButton>
          )}
        </ButtonRow>
      </Inner>
    </Container>
  );
}
