import React, { useEffect, useState } from "react";

const useTimer = ({ onFinish = (f) => f } = {}) => {
  //   states
  const [time, setTime] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);

  // variables
  let interval;

  // functions
  const startTimer = (seconds=120) => {
    if (seconds < 0) {
      setTime("00:00:00");
      return;
    }
    setIsRunning(true);
    const now = Date.now();
    const then = now + seconds * 1000;
    setTime(displayTime(seconds));
    interval = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      if (secondsLeft < 0) {
        setIsRunning(false);
        clearInterval(interval);
        onFinish();
        return;
      }

      setTime(displayTime(secondsLeft));
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(interval);
    setIsRunning(false);
  };

  const displayTime = (seconds) => {
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor((seconds - hours * 60 * 60) / 60);
    const reminderSeconds = Math.floor(seconds % 60);

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${reminderSeconds < 10 ? "0" + reminderSeconds : reminderSeconds}`;
  };

  // effects
  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  }, []);

  return { startTimer, stopTimer, time, isRunning };
};

export default useTimer;
