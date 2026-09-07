import { useState, useRef, useEffect, useCallback } from 'react';

const BASE_INTERVAL = 1500;

export default function usePlayback({ total, setStep }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef(null);
  const isPlayingRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const startTimer = useCallback(
    (intervalSpeed) => {
      clearTimer();
      timerRef.current = setInterval(() => {
        setStep((current) => {
          if (current + 1 > total) {
            isPlayingRef.current = false;
            setIsPlaying(false);
            clearInterval(timerRef.current);
            timerRef.current = null;
            return current;
          }
          return current + 1;
        });
      }, BASE_INTERVAL / intervalSpeed);
    },
    [total, setStep, clearTimer]
  );

  const play = useCallback(() => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    startTimer(speed);
  }, [speed, startTimer]);

  const togglePlayPause = useCallback(() => {
    if (isPlayingRef.current) {
      stop();
    } else {
      play();
    }
  }, [stop, play]);

  const handleSpeedChange = useCallback(
    (newSpeed) => {
      setSpeed(newSpeed);
      if (isPlayingRef.current) {
        startTimer(newSpeed);
      }
    },
    [startTimer]
  );

  const reset = useCallback(() => {
    stop();
    setStep(1);
  }, [stop, setStep]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    isPlaying,
    speed,
    play,
    togglePlayPause,
    handleSpeedChange,
    reset,
  };
}
