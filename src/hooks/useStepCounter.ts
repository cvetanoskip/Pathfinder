import { useEffect, useState, useRef, useCallback } from "react";
import { Pedometer } from "expo-sensors";
import { AppState, AppStateStatus } from "react-native";
import useStore from "../store/useStore";

export const useStepCounter = (isTracking: boolean, distance: number) => {
  const strideLength = useStore((state) => state.strideLength);
  const [steps, setSteps] = useState(0);

  const subscriptionRef = useRef<any>(null);
  const baseStepsRef = useRef<number | null>(null);
  const lastDistanceRef = useRef(0);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const accumulatedStepsRef = useRef(0);
  const canUseRef = useRef(false);

  const currentStepsRef = useRef(0);
  useEffect(() => {
    currentStepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const { status } = await Pedometer.requestPermissionsAsync();
        const available = await Pedometer.isAvailableAsync();
        if (isMounted) {
          canUseRef.current = status === "granted" && available;
          if (isTracking && canUseRef.current) startPedometer();
        }
      } catch (_) {}
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const stopPedometer = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    baseStepsRef.current = null;
  }, []);

  const startPedometer = useCallback(() => {
    if (!canUseRef.current) return;
    stopPedometer();

    subscriptionRef.current = Pedometer.watchStepCount((result) => {
      if (appStateRef.current === "active") {
        if (baseStepsRef.current === null) {
          baseStepsRef.current = result.steps;
        }
        const sessionSteps = result.steps - baseStepsRef.current;
        const total = accumulatedStepsRef.current + sessionSteps;
        setSteps(total);
      }
    });
  }, [stopPedometer]);

  useEffect(() => {
    if (!isTracking) {
      stopPedometer();
      setSteps(0);
      accumulatedStepsRef.current = 0;
      return;
    }

    lastDistanceRef.current = distance;
    startPedometer();

    return () => stopPedometer();
  }, [isTracking, startPedometer, stopPedometer]);

  useEffect(() => {
    if (!isTracking) return;

    const sub = AppState.addEventListener("change", (nextState) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState.match(/inactive|background/)) {
        accumulatedStepsRef.current = currentStepsRef.current;
        stopPedometer();
      } else if (prev.match(/inactive|background/) && nextState === "active") {
        startPedometer();
      }
    });

    return () => sub.remove();
  }, [isTracking, startPedometer, stopPedometer]);

  useEffect(() => {
    if (!isTracking || appStateRef.current === "active") {
      lastDistanceRef.current = distance;
      return;
    }

    const delta = distance - lastDistanceRef.current;
    if (delta > 0) {
      const estimated = Math.floor((delta * 1000) / strideLength);
      accumulatedStepsRef.current += estimated;
      lastDistanceRef.current = distance;
      setSteps(accumulatedStepsRef.current);
    }
  }, [distance, isTracking, strideLength]);

  return steps;
};
