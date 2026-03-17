import { calculateDistance } from "../../utils/haversine";

const MIN_MOVE = 0.0025;
const MAX_MOVE = 0.2;

const leftoverDistanceRef: { current: number } = { current: 0 };

export const addPoint = (
  latitude: number,
  longitude: number,
  setLocation: React.Dispatch<
    React.SetStateAction<{ latitude: number; longitude: number } | null>
  >,
  setRoute: React.Dispatch<
    React.SetStateAction<{ latitude: number; longitude: number }[]>
  >,
  distanceRef: React.MutableRefObject<number>,
) => {
  setLocation({ latitude, longitude });

  setRoute((prev) => {
    if (prev.length > 0) {
      const last = prev[prev.length - 1];
      const added = calculateDistance(
        last.latitude,
        last.longitude,
        latitude,
        longitude,
      );

      leftoverDistanceRef.current += added;

      if (
        leftoverDistanceRef.current > MIN_MOVE &&
        leftoverDistanceRef.current < MAX_MOVE
      ) {
        distanceRef.current += leftoverDistanceRef.current;
        leftoverDistanceRef.current = 0;
      }
    }
    return [...prev, { latitude, longitude }];
  });
};
