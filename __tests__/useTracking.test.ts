import { renderHook, act } from "@testing-library/react-native";
import { useTracking } from "../src/hooks/useTracking";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { AppState } from "react-native";

jest.mock("../src/hooks/helpers/permissions", () => ({
  checkForegroundPermission: jest.fn(),
  requestForegroundPermission: jest.fn(),
  requestBackgroundPermission: jest.fn(),
}));

jest.mock("../src/hooks/helpers/route", () => ({
  addPoint: jest.fn(),
}));

jest.mock("../src/hooks/helpers/timer", () => ({
  startTimer: jest.fn(),
  stopTimer: jest.fn(),
}));

jest.mock("expo-keep-awake", () => ({
  activateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwake: jest.fn(),
  useKeepAwake: jest.fn(),
}));

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  requestBackgroundPermissionsAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  getBackgroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  startLocationUpdatesAsync: jest.fn(),
  stopLocationUpdatesAsync: jest.fn(),
  Accuracy: {
    Balanced: 3,
    High: 5,
  },
}));

jest.mock("expo-task-manager", () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn(),
}));

import {
  checkForegroundPermission,
  requestForegroundPermission,
  requestBackgroundPermission,
} from "../src/hooks/helpers/permissions";
import { startTimer, stopTimer } from "../src/hooks/helpers/timer";

const mockLocation = (lat: number, lon: number, accuracy = 5) => ({
  coords: { latitude: lat, longitude: lon, accuracy },
  timestamp: Date.now(),
});

describe("useTracking", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (checkForegroundPermission as jest.Mock).mockResolvedValue(true);
    (requestForegroundPermission as jest.Mock).mockResolvedValue(true);
    (requestBackgroundPermission as jest.Mock).mockResolvedValue(true);

    (startTimer as jest.Mock).mockReturnValue(null);
    (stopTimer as jest.Mock).mockImplementation((timerRef) => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });

    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      { status: "granted" },
    );
    (Location.requestBackgroundPermissionsAsync as jest.Mock).mockResolvedValue(
      { status: "granted" },
    );
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getBackgroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(
      mockLocation(52.52, 13.4),
    );
    (Location.watchPositionAsync as jest.Mock).mockResolvedValue({
      remove: jest.fn(),
    });
    (Location.startLocationUpdatesAsync as jest.Mock).mockResolvedValue(
      undefined,
    );
    (Location.stopLocationUpdatesAsync as jest.Mock).mockResolvedValue(
      undefined,
    );

    (TaskManager.isTaskRegisteredAsync as jest.Mock).mockResolvedValue(false);

    Object.defineProperty(AppState, "currentState", {
      get: () => "active",
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("starts with empty route and zero distance", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    expect(result.current.route).toHaveLength(0);
    expect(result.current.distance).toBe(0);
    expect(result.current.isTracking).toBe(false);
  });

  it("sets permissionStatus to granted when permission is given", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    expect(result.current.permissionStatus).toBe("granted");
  });

  it("sets permissionStatus to denied when permission is refused", async () => {
    (checkForegroundPermission as jest.Mock).mockResolvedValue(false);
    (requestForegroundPermission as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    expect(result.current.permissionStatus).toBe("denied");
  });

  it("fetches current location on mount when permission granted", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    expect(result.current.location).toEqual({
      latitude: 52.52,
      longitude: 13.4,
    });
  });

  it("sets isTracking to true after startTracking", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    expect(result.current.isTracking).toBe(true);
  });

  it("sets isTracking to false after stopTracking", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    await act(async () => {
      await result.current.stopTracking();
    });
    expect(result.current.isTracking).toBe(false);
  });

  it("resets route and distance on new startTracking", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    await act(async () => {
      await result.current.stopTracking();
    });
    await act(async () => {
      await result.current.startTracking();
    });
    expect(result.current.route).toHaveLength(0);
    expect(result.current.distance).toBe(0);
  });

  it("does not start tracking if permission is denied", async () => {
    (checkForegroundPermission as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    expect(result.current.isTracking).toBe(false);
  });

  it("does not start tracking if already tracking", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    await act(async () => {
      await result.current.startTracking();
    });
    expect(Location.watchPositionAsync).toHaveBeenCalledTimes(1);
  });

  it("starts background location updates when background permission granted", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    expect(Location.startLocationUpdatesAsync).toHaveBeenCalledWith(
      "background-location-task",
      expect.objectContaining({
        accuracy: Location.Accuracy.High,
      }),
    );
  });

  it("does not start background task if already registered", async () => {
    (TaskManager.isTaskRegisteredAsync as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    expect(Location.startLocationUpdatesAsync).not.toHaveBeenCalled();
  });

  it("does not start background task if permission denied", async () => {
    (requestBackgroundPermission as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    expect(Location.startLocationUpdatesAsync).not.toHaveBeenCalled();
  });

  it("stops background location updates on stopTracking", async () => {
    (TaskManager.isTaskRegisteredAsync as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    await act(async () => {
      await result.current.stopTracking();
    });
    expect(Location.stopLocationUpdatesAsync).toHaveBeenCalledWith(
      "background-location-task",
    );
  });

  it("stopTracking does nothing if not tracking", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.stopTracking();
    });
    expect(Location.stopLocationUpdatesAsync).not.toHaveBeenCalled();
  });

  it("calls startTimer when tracking starts", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    expect(startTimer).toHaveBeenCalled();
  });

  it("calls stopTimer when tracking stops", async () => {
    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });
    await act(async () => {
      await result.current.stopTracking();
    });
    expect(stopTimer).toHaveBeenCalled();
  });

  it("re-checks permission when app comes to foreground", async () => {
    let appStateCallback: ((state: string) => void) | null = null;

    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((event: any, cb: any) => {
        if (event === "change") appStateCallback = cb;
        return { remove: jest.fn() };
      });

    renderHook(() => useTracking());
    await act(async () => {});

    await act(async () => {
      appStateCallback?.("background");
      appStateCallback?.("active");
    });

    expect(checkForegroundPermission).toHaveBeenCalledTimes(2);
  });

  it("stops timer when app goes to background while tracking", async () => {
    let appStateCallback: ((state: string) => void) | null = null;

    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((event: any, cb: any) => {
        if (event === "change") appStateCallback = cb;
        return { remove: jest.fn() };
      });

    const { result } = renderHook(() => useTracking());
    await act(async () => {});
    await act(async () => {
      await result.current.startTracking();
    });

    const stopTimerCallsBefore = (stopTimer as jest.Mock).mock.calls.length;

    await act(async () => {
      appStateCallback?.("background");
    });

    expect((stopTimer as jest.Mock).mock.calls.length).toBeGreaterThan(
      stopTimerCallsBefore,
    );
  });
});
