export const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export const formatPace = (pace: number | null) => {
  if (pace === null) return "--:--";
  const mins = Math.floor(pace);
  const secs = Math.floor((pace - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
