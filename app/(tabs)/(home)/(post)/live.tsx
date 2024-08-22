import { daysFull, formatSessionDate } from "@/services/utilities";
import * as Types from "@/types";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
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
  Circle,
  Square,
  AlertDialog,
  Portal,
  PortalProvider,
} from "tamagui";
import { ExercisesContext } from "./_layout";
import ExerciseAccordion from "@/components/post/accordionItem";
import { isLoaded } from "expo-font";
import { LinearGradient } from "tamagui/linear-gradient";
import { useColorScheme } from "react-native";
import { appendSession } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";
import { useShakeAnimation } from "@/components/auth/shakeAnimation";
import Animated from "react-native-reanimated";
import StopWatch from "@/components/post/stopwatch";
import { Check, Pause, Play, Scale, Scroll } from "@tamagui/lucide-icons";
import PauseFinishAlert from "@/components/post/pauseFinishAlert";
import { useTimer } from "@/components/post/timeContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const LivePost = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const { exercises, setExercises } = useContext(ExercisesContext);
  const [loading, setLoading] = useState(false);
  const colorMode = useColorScheme();
  const gradientColor = colorMode === "dark" ? "#006666" : "#33e6e6";
  const [workoutName, setWorkoutName] = useState("");
  const [location, setLocation] = useState("");
  const workoutPlaceholder = daysFull[new Date().getDay()] + "'s workout";
  const locationPlaceholder = "Earth, Milky Way Galaxy";
  const { user } = useUser();
  const [error, setError] = useState(false);
  const shake = useShakeAnimation(error);
  const { time, setTime, isRunning, setIsRunning } = useTimer();

  const startStopTimer = () => {
    if (isRunning == true) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const validatePost = () => {
    if (exercises.length === 0) {
      return false;
    }

    let output = true;
    exercises.forEach((exercise) => {
      if (exercise.sets.length === 0) {
        output = false;
        return;
      }
      exercise.sets.forEach((set) => {
        if (set.reps === 0 || set.weight === 0) {
          output = false;
          return;
        }
      });
    });
    return output;
  };

  const onPressPost = async () => {
    setLoading(true);
    // close alert box and stop timer
    // setShowAlert(false);
    setIsRunning(false);
    if (!isLoaded || !validatePost()) {
      setLoading(false);
      setError(true);
      await new Promise((resolve) => setTimeout(resolve, 1));
      setError(false);
      console.log("Error posting");
      return;
    }

    const sessionKey = `${user?.id}session_${startDate.getTime()}`;
    const session = {
      sessionKey: sessionKey,
      sessionData: {
        name: workoutName ? workoutName : daysFull[startDate.getDay()] + "'s workout",
        likes: [],
        exercises: exercises.map((exercise) => exercise.name),
        comments: [],
        location: location ? location : locationPlaceholder,
        duration: time,
        date: startDate.toISOString(),
      },
      exerciseData: exercises.map((exercise) => ({
        name: exercise.name,
        muscle: exercise.muscle,
        sessionId: sessionKey,
        lists: {
          reps: exercise.sets.map((set) => set.reps),
          weight: exercise.sets.map((set) => set.weight),
        },
      })),
    };

    if (user) await appendSession(user.id, session);

    setLoading(false);
    // router.replace('/(tabs)/(home)/index');
  };
  return (
    <PortalProvider>
      <YStack
        backgroundColor={"$background"}
        gap={"$4"}
        padding={"$3"}
        pt={"$0"}
        flex={1}
        justifyContent="space-between"
      >
        <YStack>
          <StopWatch />
          <YGroup separator={<Separator />}>
            <YGroup.Item>
              <Input
                borderWidth="$0"
                fontFamily={"$mono"}
                placeholder={workoutPlaceholder}
                value={workoutName} // Bind the input value to the state
                onChangeText={setWorkoutName} // Update the state when the input value changes
              ></Input>
            </YGroup.Item>
            <YGroup.Item>
              <Input
                borderWidth="$0"
                fontFamily={"$mono"}
                placeholder="Location"
                value={location} // Bind the input value to the state
                onChangeText={setLocation} // Update the state when the input value changes
              ></Input>
            </YGroup.Item>
            {/* <Button onPress={reset}>Reset</Button> */}
          </YGroup>

          <YStack
            gap={"$3"}
            pt={"$3"}
          >
            {exercises.map((exercise: Types.Exercise, i: number) => (
              <ExerciseAccordion
                exercise={exercise}
                key={i}
              />
            ))}
            {isRunning && (
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/(exercisesModal)",
                    params: { source: "live" },
                  });
                }}
                style={{
                  paddingTop: 0,
                }}
              >
                <ListItem
                  fontFamily={"$mono"}
                  color={"#00cccc"}
                  fontWeight={"$15"}
                  borderRadius={"$3"}
                >
                  Add Exercise
                </ListItem>
              </TouchableOpacity>
            )}
          </YStack>
        </YStack>

        <XStack
          gap="$3"
          // pos={"absolute"}
          // bottom={"$4"}
          alignSelf="center"
        >
          {!isRunning && time > 0 && (
            <Animated.View style={[shake]}>
              <LinearGradient
                width={"$8"}
                height={"$8"}
                alignItems="center"
                alignSelf="center"
                justifyContent="center"
                borderRadius="$12"
                colors={["#00cccc", gradientColor]}
                start={[1, 0]}
                end={[0, 1]}
                pressStyle={{ scale: 0.85 }}
                animation={"100ms"}
                animatePresence
                onPress={() => {
                  // onPressPost();
                }}
              >
                <FontAwesome5
                  name="flag-checkered"
                  size={28}
                />
                {/* <Text
                  fontFamily={"$mono"}
                  fontWeight={700}
                  fontSize={"$5"}
                >
                  Finish
                </Text> */}
              </LinearGradient>
            </Animated.View>
          )}
          <LinearGradient
            width={"$8"}
            height={"$8"}
            alignItems="center"
            alignSelf="center"
            justifyContent="center"
            borderRadius="$12"
            colors={["#00cccc", gradientColor]}
            start={[1, 0]}
            end={[0, 1]}
            pressStyle={{ scale: 0.85 }}
            animation="100ms"
            onPress={() => {
              startStopTimer();
            }}
            disabled={!isLoaded}
          >
            {isRunning ? (
              <Square
                size={"$2"}
                backgroundColor="$white1"
                elevation="$4"
              />
            ) : (
              <Play
                size="$3"
                fill="white"
                color="$white"
                l="$1"
              />
            )}
          </LinearGradient>
        </XStack>
      </YStack>
    </PortalProvider>
  );
};

export default LivePost;
