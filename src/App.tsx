import { useState, useEffect, useRef } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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
    <Stack alignItems="center" padding={4}>
      <Card sx={{ width: "fit-content", marginBottom: "24px" }}>
        <CardContent>
          <Typography variant="h2" mb={3} id="break-label">
            Break Length
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={4}
          >
            <Button
              id="break-decrement"
              onClick={decrementBreakLength}
              variant="contained"
              sx={{ height: "50%" }}
            >
              -
            </Button>
            <Typography variant="h3" id="break-length">
              {breakLength}
            </Typography>
            <Button
              id="break-increment"
              onClick={incrementBreakLength}
              variant="contained"
              sx={{ height: "50%" }}
            >
              +
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ width: "fit-content", marginBottom: "24px" }}>
        <CardContent>
          <Typography variant="h2" id="session-label" mb={3}>
            Session Length
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={4}
          >
            <Button
              id="session-decrement"
              variant="contained"
              onClick={decrementSessionLength}
            >
              -
            </Button>
            <Typography variant="h3" id="session-length">
              {sessionLength}
            </Typography>
            <Button
              id="session-increment"
              onClick={incrementSessionLength}
              variant="contained"
            >
              +
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack alignItems="center" mb={4}>
            <Typography variant="h2" id="timer-label" mb={1}>
              {timerLabel}
            </Typography>
            <Typography variant="h3" id="time-left">
              {formatTime(timeLeft)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            gap={4}
          >
            <Button id="reset" onClick={handleReset} variant="contained">
              Reset
            </Button>
            <Button
              id="start_stop"
              onClick={handleStartStop}
              variant="contained"
            >
              Start/Stop
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <audio id="beep" src="/sounds/alarm.wav"></audio>
    </Stack>
  );
};

export default App;
