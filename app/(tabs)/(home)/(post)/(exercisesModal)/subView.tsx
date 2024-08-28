import { Text } from "react-native";
import React, { useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ListItem, ScrollView, YGroup, View, YStack } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import gainzExercises from "@/services/GainzExercises.json";
import { useExercises } from "@/components/post/exercisesContext";
import * as Types from "@/types";

const SubView = () => {
  const params = useLocalSearchParams();
  const { muscle, source } = params;
  const query = ((params.query as string) || "").toLowerCase().trim();
  const targetMuscleExercises = Object.keys((gainzExercises as any)[muscle as string]);
  const { exercises, setExercises } = useExercises()

  const handleExercisePress = (exercise: string) => {
    const addExercise = (exerciseName: string) => {
      if (exercises.some((e) => e.name === exerciseName)) {
        return;
      }
      const newExercise: Types.Exercise = {
        name: exerciseName,
        muscle: muscle as string,
        sets: [],
        PR: 0,
      };
      setExercises([...exercises, newExercise]);
    };
    addExercise(exercise);
    
    router.navigate({
      pathname: source as string || "manual",
    });
  };

  return (
    <YStack
      backgroundColor={"$gray3"}
      p="$3"
      pb="$5"
      height={"100%"}
    >
      <ScrollView>
        <YGroup
          alignSelf="center"
          size="$5"
        >
          {targetMuscleExercises
            .filter((name) => name.toLowerCase().includes(query))
            .map((exercise, i) => (
              <YGroup.Item key={i}>
                <ListItem
                  pressStyle={{ backgroundColor: "$gray2" }}
                  fontFamily={"$mono"}
                  iconAfter={ChevronRight}
                  backgroundColor={"$gray5"}
                  onPress={() => {
                    handleExercisePress(exercise);
                  }}
                >
                  {exercise}
                </ListItem>
              </YGroup.Item>
            ))}
        </YGroup>
      </ScrollView>
    </YStack>
  );
};

export default SubView;
