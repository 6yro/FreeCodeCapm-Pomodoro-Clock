import { useState, useEffect, useRef } from "react";

const App = () => {
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [timerLabel, setTimerLabel] = useState<string>("Session");
  const [timeLeft, setTimeLeft] = useState<number>(sessionLength * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
    if (!isRunning && timeLeft === sessionLength * 60) {
      setTimeLeft(sessionLength * 60);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel("Session");
    setTimeLeft(25 * 60);

    const beepSound = document.getElementById("beep") as HTMLAudioElement;
    beepSound.pause();
    beepSound.currentTime = 0;
  };

  const decrementBreakLength = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const playBeep = () => {
    const beepSound = document.getElementById("beep") as HTMLAudioElement;
    beepSound.play();
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            playBeep();
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              setTimeLeft(breakLength * 60);
            } else {
              setTimerLabel("Session");
              setTimeLeft(sessionLength * 60);
            }
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, breakLength, sessionLength, timerLabel]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div className="App">
      <h2 id="break-label">Break Length</h2>
      <button id="break-increment" onClick={incrementBreakLength}>
        +
      </button>
      <h3 id="break-length">{breakLength}</h3>
      <button id="break-decrement" onClick={decrementBreakLength}>
        -
      </button>
      <h2 id="session-label">Session Length</h2>
      <button id="session-increment" onClick={incrementSessionLength}>
        +
      </button>
      <div id="session-length">{sessionLength}</div>
      <button id="session-decrement" onClick={decrementSessionLength}>
        -
      </button>
      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>
      <button id="start_stop" onClick={handleStartStop}>
        Start/Stop
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>
      <audio id="beep" src="/sounds/alarm.wav"></audio>
    </div>
  );
};

export default App;
