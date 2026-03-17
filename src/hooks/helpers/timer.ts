export const startTimer = (
  startTimeRef: React.MutableRefObject<number | null>,
  isTrackingRef: React.MutableRefObject<boolean>,
  setDuration: React.Dispatch<React.SetStateAction<number>>,
): ReturnType<typeof setInterval> | null => {
  if (!isTrackingRef.current || startTimeRef.current === null) return null;

  setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));

  return setInterval(() => {
    if (startTimeRef.current && isTrackingRef.current) {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }
  }, 1000);
};

export const stopTimer = (
  timerRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
) => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
};
