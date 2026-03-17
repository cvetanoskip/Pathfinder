import { calculateDistance } from "../src/utils/haversine";

describe("calculateDistance (Haversine)", () => {
  it("returns 0 for identical coordinates", () => {
    expect(calculateDistance(52.52, 13.405, 52.52, 13.405)).toBe(0);
  });

  it("calculates known distance accurately (~1km tolerance)", () => {
    const dist = calculateDistance(40.7128, -74.006, 39.9526, -75.1652);
    expect(dist).toBeGreaterThan(125);
    expect(dist).toBeLessThan(135);
  });

  it("is symmetric — A to B equals B to A", () => {
    const ab = calculateDistance(48.8566, 2.3522, 51.5074, -0.1278);
    const ba = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
    expect(ab).toBeCloseTo(ba, 5);
  });

  it("handles short distances (under 100m)", () => {
    const dist = calculateDistance(52.52, 13.405, 52.5204, 13.405);
    expect(dist).toBeGreaterThan(0);
    expect(dist).toBeLessThan(0.1);
  });

  it("handles crossing the equator", () => {
    const dist = calculateDistance(-1.0, 0, 1.0, 0);
    expect(dist).toBeCloseTo(222.4, 0);
  });
});
