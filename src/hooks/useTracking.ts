import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useState, useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";

import { addPoint } from "./helpers/route";
import { startTimer, stopTimer } from "./helpers/timer";
import {
  checkForegroundPermission,
  requestForegroundPermission,
  requestBackgroundPermission,
} from "./helpers/permissions";

const backgroundCallbackRef = {
  current: null as
    | ((coords: { latitude: number; longitude: number }) => void)
    | null,
};

export const BACKGROUND_LOCATION_TASK = "background-location-task";

TaskManager.defineTask(
  BACKGROUND_LOCATION_TASK,
  async ({ data, error }: { data?: any; error?: any }) => {
    if (error) {
      console.error("Background location task error:", error);
      return;
    }
    if (!data?.locations?.length || !backgroundCallbackRef.current) return;

    const loc = data.locations[0] as Location.LocationObject;
    const { latitude, longitude, accuracy } = loc.coords;

    if (accuracy && accuracy <= 20) {
      backgroundCallbackRef.current({ latitude, longitude });
    }
  },
);

const stopBackgroundTask = async () => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_LOCATION_TASK,
    );
    if (isRegistered) {
      await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
    }
  } catch (err) {
    console.warn("Failed to stop background task:", err);
  }
};

export const useTracking = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>(
    [],
  );
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");
  const [error, setError] = useState<string | null>(null);

  const watcherRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isTrackingRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const distanceRef = useRef(0);

  const checkAndSetLocation = useCallback(async () => {
    const hasPermission = await checkForegroundPermission();
    if (!hasPermission) {
      setPermissionStatus("denied");
      return;
    }
    setPermissionStatus("granted");

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setError(null);
    } catch (err: any) {
      setError(`Failed to get current location: ${err.message}`);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await requestForegroundPermission();
      await checkAndSetLocation();
    })();
  }, [checkAndSetLocation]);

  const syncTimer = useCallback(() => {
    stopTimer(timerRef);
    if (isTrackingRef.current && startTimeRef.current !== null) {
      const timer = startTimer(startTimeRef, isTrackingRef, setDuration);
      if (timer !== null) {
        timerRef.current = timer;
      }
    }
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener(
      "change",
      async (nextState: AppStateStatus) => {
        const prev = appStateRef.current;
        appStateRef.current = nextState;

        const isComingToForeground =
          prev !== null &&
          typeof prev === "string" &&
          prev.match(/inactive|background/) &&
          nextState === "active";

        const isGoingToBackground =
          nextState !== null &&
          typeof nextState === "string" &&
          nextState.match(/inactive|background/);

        if (isComingToForeground) {
          await checkAndSetLocation();
          syncTimer();
        }

        if (isGoingToBackground && isTrackingRef.current) {
          stopTimer(timerRef);
        }
      },
    );

    return () => sub.remove();
  }, [checkAndSetLocation, syncTimer]);

  const handleAddPoint = useCallback((latitude: number, longitude: number) => {
    addPoint(latitude, longitude, setLocation, setRoute, distanceRef);
    setDistance(distanceRef.current);
  }, []);

  const startTracking = useCallback(async () => {
    if (isTrackingRef.current) return;

    const hasPermission = await checkForegroundPermission();
    if (!hasPermission) {
      setPermissionStatus("denied");
      return;
    }

    setError(null);
    setRoute([]);
    setDistance(0);
    setDuration(0);
    distanceRef.current = 0;
    startTimeRef.current = Date.now();
    isTrackingRef.current = true;
    setIsTracking(true);

    backgroundCallbackRef.current = ({ latitude, longitude }) => {
      if (isTrackingRef.current) handleAddPoint(latitude, longitude);
    };

    const timer = startTimer(startTimeRef, isTrackingRef, setDuration);
    if (timer !== null) {
      timerRef.current = timer;
    }

    const bgGranted = await requestBackgroundPermission();
    if (bgGranted) {
      if (appStateRef.current === "active") {
        try {
          const isRegistered = await TaskManager.isTaskRegisteredAsync(
            BACKGROUND_LOCATION_TASK,
          );
          if (!isRegistered) {
            await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
              accuracy: Location.Accuracy.High,
              distanceInterval: 1,
              timeInterval: 1000,
              foregroundService: {
                notificationTitle: "PathFinder",
                notificationBody: "Tracking your route...",
                notificationColor: "#FF6B35",
              },
              pausesUpdatesAutomatically: false,
              showsBackgroundLocationIndicator: true,
            });
          }
        } catch (err) {
          console.warn("Could not start background task:", err);
        }
      }
    }

    watcherRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 1,
        timeInterval: 1000,
      },
      (loc) => {
        if (appStateRef.current !== "active") return;
        const { latitude, longitude, accuracy } = loc.coords;
        if (accuracy && accuracy > 20) return;
        handleAddPoint(latitude, longitude);
      },
    );
  }, [handleAddPoint]);

  const stopTracking = useCallback(async () => {
    if (!isTrackingRef.current) return;

    isTrackingRef.current = false;
    backgroundCallbackRef.current = null;
    setIsTracking(false);
    setError(null);

    if (startTimeRef.current !== null) {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      startTimeRef.current = null;
    }

    stopTimer(timerRef);

    if (watcherRef.current) {
      watcherRef.current.remove();
      watcherRef.current = null;
    }

    await stopBackgroundTask();
  }, []);

  useEffect(() => {
    return () => {
      void stopTracking();
    };
  }, [stopTracking]);

  const pace = distance > 0.05 ? duration / 60 / distance : null;

  return {
    location,
    route,
    distance,
    duration,
    pace,
    isTracking,
    permissionStatus,
    error,
    startTracking,
    stopTracking,
  };
};
