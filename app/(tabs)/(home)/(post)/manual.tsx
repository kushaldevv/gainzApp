import { daysFull, formatSessionDate } from "@/services/utilities";
import * as Types from "@/types";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
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
} from "tamagui";
import { ExercisesContext } from "./_layout";
import ExerciseAccordion from "@/components/post/accordionItem";
import { isLoaded } from "expo-font";
import { LinearGradient } from "tamagui/linear-gradient";
import { useColorScheme } from "react-native";
import { appendSession } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";

const ManualPost = () => {
  const [startDate, setStartDate] = useState(new Date());
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


  const validatePost = () => {
    if (exercises.length === 0) return false;
    
    
  }

  const onPressPost = async () => {
    setLoading(true);

    if (!isLoaded || !validatePost()) {
      setLoading(false);
      return;
    }

    if (endDate.getTime() < startDate.getTime()) {
      setEndDate(startDate);
    }

    const sessionKey = `${user?.id}session_${new Date().getTime()}`;
    const session = {
      sessionKey: sessionKey,
      sessionData: {
        name: workoutName ? workoutName : workoutPlaceholder,
        likes: [],
        exercises: exercises.map((exercise) => exercise.name),
        comments: [],
        location: location ? location : locationPlaceholder,
        duration: 4000,
        date: startDate,
      },
      exerciseData: exercises.map((exercise) => ({
        name: exercise.name,
        sessionId: sessionKey,
        lists: {
          reps: exercise.sets.map((set) => set.reps),
          weight: exercise.sets.map((set) => set.weight),
        }
      })),
    };

    if (user)
      await appendSession(user.id, session);

    setLoading(false);
  };

  return (
    <ScrollView backgroundColor={"$background"}>
      <YStack
        flex={1}
        alignItems="center"
        gap={"$4"}
        padding={"$3"}
      >
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
          <YGroup.Item>
            {/* <ListItem title="Start Time"/> */}
            <XStack
              alignItems="center"
              justifyContent="space-between"
            >
              <ListItem>
                <Text fontFamily={"$mono"}>Start Time</Text>
                <TouchableOpacity onPress={() => setStartOpen(true)}>
                  <Text
                    fontFamily={"$mono"}
                    color={"#00cccc"}
                  >
                    {formatSessionDate(startDate.toISOString())}
                  </Text>
                </TouchableOpacity>
              </ListItem>
            </XStack>
          </YGroup.Item>
          <YGroup.Item>
            <XStack
              alignItems="center"
              justifyContent="space-between"
            >
              <ListItem>
                <Text fontFamily={"$mono"}>End Time</Text>
                <TouchableOpacity onPress={() => setEndOpen(true)}>
                  <Text
                    fontFamily={"$mono"}
                    color={"#00cccc"}
                  >
                    {formatSessionDate(endDate.toISOString())}
                  </Text>
                </TouchableOpacity>
              </ListItem>
            </XStack>
          </YGroup.Item>
        </YGroup>
        {exercises.map((exercise: Types.ExerciseViewProp, i: number) => (
          <ExerciseAccordion
            exercise={exercise}
            key={i}
          />
        ))}
        <YGroup
          width={"100%"}
          separator={<Separator />}
        >
          <TouchableOpacity onPress={() => router.push("/(exercisesModal)")}>
            <YGroup.Item>
              <ListItem
                fontFamily={"$mono"}
                color={"#00cccc"}
                fontWeight={"$15"}
              >
                Add Exercise
              </ListItem>
            </YGroup.Item>
          </TouchableOpacity>
          {/* <Button alignSelf="center"  borderRadius={"$5"} height="$3" size="$8" fontSize={"$5"} fontFamily="$mono" backgroundColor={"#00cccc"} mt={20}>
            Post
          </Button> */}
          <TouchableOpacity
            disabled={!isLoaded}
            onPress={onPressPost}
            style={{ marginTop: 20 }}
          >
            <LinearGradient
              borderRadius="$5"
              colors={["#00cccc", gradientColor]}
              start={[0, 0]}
              end={[0, 1]}
              alignItems="center"
              p="$3"
              gap="$2"
              height={"$4"}
            >
              {loading ? (
                <Spinner
                  size="small"
                  color="$accentColor"
                />
              ) : (
                <Button.Text
                  fontWeight={"$8"}
                  fontSize={"$5"}
                  fontFamily={"$mono"}
                >
                  Post
                </Button.Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </YGroup>

        <DatePicker
          modal
          open={startOpen}
          date={startDate}
          onConfirm={(date) => {
            setStartOpen(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setStartOpen(false);
          }}
        />
        <DatePicker
          modal
          open={endOpen}
          date={endDate}
          onConfirm={(date) => {
            setEndOpen(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setEndOpen(false);
          }}
        />
      </YStack>
    </ScrollView>
  );
};

export default ManualPost;
