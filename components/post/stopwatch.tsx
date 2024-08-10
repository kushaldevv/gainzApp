import React, { useEffect, useState } from 'react';
import {
    Button,
    Input,
    ListItem,
    ScrollView,
    Separator,
    Spinner,
    Text,
    XStack,
    YGroup,
    YStack,
  } from "tamagui";
import { useTimer } from '@/app/(tabs)/(home)/(post)/(exercisesModal)/timeContext';


const StopWatch = () => {
//   const [time, setTime] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);
  const { time, setTime, isRunning } = useTimer();

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
        // setting time from 0 to 1 every 1 second using javascript setInterval method
        intervalId = setInterval(() => setTime(time + 1), 1000);
    }
    return () => clearInterval(intervalId);
  })

  // Hours calculation
  const hours = Math.floor(time / 360000);

  // Minutes calculation
//   const minutes = Math.floor((time % 360000) / 6000);
  const minutes = Math.floor(time / 60);

  // Seconds calculation
//   const seconds = Math.floor((time % 6000) / 100);
  const seconds = time - minutes * 60;

//   // Method to start and stop timer
//   const startStop = () => {
//     setIsRunning(!isRunning);
//   };

//   // Method to reset timer back to 0
//   const reset = () => {
//     setTime(0);
//   };

  return (
        <>
        <Text fontFamily={"$mono"} fontSize={"$13"} fontWeight={500}>
        {hours.toString().padStart(2, "0")}:
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
        </Text>

        {/* <Button onPress={startStop}>{isRunning ? "Stop" : "Start"}</Button>
        <Button onPress={reset}>Reset</Button> */}
        </>
       
  )
}

export default StopWatch;