import { renderHook, act } from "@testing-library/react-native";
import { useStepCounter } from "../src/hooks/useStepCounter";
import { Pedometer } from "expo-sensors";
import { AppState, AppStateStatus } from "react-native";

jest.mock("expo-sensors", () => ({
  Pedometer: {
    requestPermissionsAsync: jest.fn(),
    isAvailableAsync: jest.fn(),
    watchStepCount: jest.fn(),
  },
}));

jest.mock("../src/store/useStore", () => ({
  __esModule: true,
  default: (selector: any) =>
    selector({
      strideLength: 0.762,
      activities: [],
      setStrideLength: jest.fn(),
    }),
}));

const flushPromises = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

describe("useStepCounter", () => {
  let stepCallback: ((result: { steps: number }) => void) | null = null;
  let appStateCallback: ((state: AppStateStatus) => void) | null = null;
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    stepCallback = null;
    appStateCallback = null;

    Object.defineProperty(AppState, "currentState", {
      get: () => "active",
      configurable: true,
    });

    (Pedometer.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Pedometer.watchStepCount as jest.Mock).mockImplementation((cb) => {
      stepCallback = cb;
      return { remove: mockRemove };
    });

    jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((event, cb: any) => {
        if (event === "change") appStateCallback = cb;
        return { remove: jest.fn() };
      });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("returns 0 steps initially", async () => {
    const { result } = renderHook(() => useStepCounter(false, 0));
    await flushPromises();
    expect(result.current).toBe(0);
  });

  it("starts pedometer when tracking begins", async () => {
    const { result } = renderHook(() => useStepCounter(true, 0));
    await flushPromises();
    expect(Pedometer.watchStepCount).toHaveBeenCalled();
  });

  it("does not start pedometer when not tracking", async () => {
    const { result } = renderHook(() => useStepCounter(false, 0));
    await flushPromises();
    expect(Pedometer.watchStepCount).not.toHaveBeenCalled();
  });

  it("counts steps correctly from pedometer", async () => {
    const { result } = renderHook(() => useStepCounter(true, 0));
    await flushPromises();

    act(() => {
      stepCallback?.({ steps: 100 });
    });
    act(() => {
      stepCallback?.({ steps: 150 });
    });

    expect(result.current).toBe(50);
  });

  it("resets steps to 0 when tracking restarts", async () => {
    let isTracking = true;
    let distance = 0;

    const { result, rerender } = renderHook(() =>
      useStepCounter(isTracking, distance),
    );
    await flushPromises();

    act(() => {
      stepCallback?.({ steps: 100 });
    });
    act(() => {
      stepCallback?.({ steps: 200 });
    });
    expect(result.current).toBe(100);

    isTracking = false;
    rerender({ isTracking, distance });
    await flushPromises();

    isTracking = true;
    rerender({ isTracking, distance });
    await flushPromises();

    expect(result.current).toBe(0);
  });

  it("stops pedometer subscription when tracking stops", async () => {
    let isTracking = true;
    let distance = 0;

    const { rerender } = renderHook(() => useStepCounter(isTracking, distance));
    await flushPromises();

    isTracking = false;
    rerender({ isTracking, distance });
    await flushPromises();

    expect(mockRemove).toHaveBeenCalled();
  });

  it("does not start pedometer if unavailable", async () => {
    (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useStepCounter(true, 0));
    await flushPromises();

    expect(Pedometer.watchStepCount).not.toHaveBeenCalled();
  });

  it("does not start pedometer if permission denied", async () => {
    (Pedometer.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useStepCounter(true, 0));
    await flushPromises();

    expect(Pedometer.watchStepCount).not.toHaveBeenCalled();
  });

  it("estimates steps from GPS distance when backgrounded", async () => {
    let isTracking = true;
    let distance = 0;

    const { result, rerender } = renderHook(() =>
      useStepCounter(isTracking, distance),
    );
    await flushPromises();

    act(() => {
      appStateCallback?.("background");
    });

    Object.defineProperty(AppState, "currentState", {
      get: () => "background",
      configurable: true,
    });

    distance = 0.1;
    rerender({ isTracking, distance });
    await flushPromises();

    expect(result.current).toBeGreaterThan(0);
    expect(result.current).toBeCloseTo(131, -1);

    Object.defineProperty(AppState, "currentState", {
      get: () => "active",
      configurable: true,
    });
  });

  it("preserves accumulated steps when returning to foreground", async () => {
    let isTracking = true;
    let distance = 0;

    const { result, rerender } = renderHook(() =>
      useStepCounter(isTracking, distance),
    );
    await flushPromises();

    act(() => {
      stepCallback?.({ steps: 1000 });
    });
    act(() => {
      stepCallback?.({ steps: 1050 });
    });
    expect(result.current).toBe(50);

    act(() => {
      appStateCallback?.("background");
    });

    act(() => {
      appStateCallback?.("active");
    });
    await flushPromises();

    act(() => {
      stepCallback?.({ steps: 2000 });
    });
    act(() => {
      stepCallback?.({ steps: 2010 });
    });

    expect(result.current).toBe(60);
  });
});
