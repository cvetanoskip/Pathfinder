import useStore from "../src/store/useStore";

describe("PathFinder Store", () => {
  beforeEach(() => {
    useStore.setState({ activities: [], strideLength: 0.762 });
  });

  it("should add a new activity with all fields", () => {
    const mockActivity = {
      date: new Date().toISOString(),
      distance: 5.2,
      duration: 1800,
      pace: 5.8,
      steps: 6840,
      coordinates: [{ latitude: 41.9, longitude: 21.4 }],
    };

    useStore.getState().addActivity(mockActivity);

    const activities = useStore.getState().activities;
    expect(activities).toHaveLength(1);
    expect(activities[0].distance).toBe(5.2);
    expect(activities[0].duration).toBe(1800);
    expect(activities[0].steps).toBe(6840);
    expect(activities[0].pace).toBe(5.8);
    expect(activities[0].id).toBeDefined();
    expect(typeof activities[0].id).toBe("string");
  });

  it("should delete an activity by id", () => {
    const id = "test-id";
    useStore.setState({
      activities: [
        {
          id,
          date: "2026-01-01",
          distance: 1,
          duration: 100,
          pace: 5,
          steps: 1200,
          coordinates: [],
        },
      ],
    });

    useStore.getState().deleteActivity(id);
    expect(useStore.getState().activities).toHaveLength(0);
  });

  it("should not delete other activities when deleting by id", () => {
    useStore.setState({
      activities: [
        {
          id: "keep",
          date: "2026-01-01",
          distance: 1,
          duration: 100,
          pace: 5,
          steps: 100,
          coordinates: [],
        },
        {
          id: "delete",
          date: "2026-01-02",
          distance: 2,
          duration: 200,
          pace: 5,
          steps: 200,
          coordinates: [],
        },
      ],
    });

    useStore.getState().deleteActivity("delete");
    const activities = useStore.getState().activities;
    expect(activities).toHaveLength(1);
    expect(activities[0].id).toBe("keep");
  });

  it("should persist multiple activities", () => {
    useStore.getState().addActivity({
      date: "2026-01-01",
      distance: 1,
      duration: 60,
      pace: 5,
      steps: 100,
      coordinates: [],
    });
    useStore.getState().addActivity({
      date: "2026-01-02",
      distance: 2,
      duration: 120,
      pace: 5,
      steps: 200,
      coordinates: [],
    });
    expect(useStore.getState().activities).toHaveLength(2);
  });

  it("should generate unique ids for each activity", () => {
    let time = 1000000;
    jest.spyOn(Date, "now").mockImplementation(() => time++);

    useStore.getState().addActivity({
      date: "2026-01-01",
      distance: 1,
      duration: 60,
      pace: 5,
      steps: 100,
      coordinates: [],
    });
    useStore.getState().addActivity({
      date: "2026-01-02",
      distance: 2,
      duration: 120,
      pace: 5,
      steps: 200,
      coordinates: [],
    });

    const [a, b] = useStore.getState().activities;
    expect(a.id).not.toBe(b.id);

    jest.spyOn(Date, "now").mockRestore();
  });

  it("should save and retrieve stride length", () => {
    useStore.getState().setStrideLength(0.85);
    expect(useStore.getState().strideLength).toBe(0.85);
  });

  it("should not modify activities when deleting non-existent id", () => {
    useStore.setState({
      activities: [
        {
          id: "real",
          date: "2026-01-01",
          distance: 1,
          duration: 60,
          pace: 5,
          steps: 100,
          coordinates: [],
        },
      ],
    });
    useStore.getState().deleteActivity("fake-id");
    expect(useStore.getState().activities).toHaveLength(1);
  });
});
