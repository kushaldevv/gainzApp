import { ChevronDown, Trash2, X } from "@tamagui/lucide-icons";
import React, { useContext, useState } from "react";
import { StyleSheet, Button, SafeAreaView, TouchableOpacity } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  View,
  ListItem,
  YGroup,
  Text,
  XStack,
  YStack,
  Input,
  Square,
  Separator,
  Label,
} from "tamagui";
import * as Types from "@/types";
import { ExercisesContext } from "@/app/(tabs)/(home)/(post)/_layout";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getMuscleColor } from "@/services/utilities";

export function AccordionItem({
  isExpanded,
  children,
  viewKey,
  duration = 200,
}: {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
  viewKey: string;
  duration?: number;
}) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle]}
    >
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}

export default function ExerciseAccordion({
  exercise,
  inCard,
}: {
  exercise: Types.Exercise;
  inCard?: boolean;
}) {
  const open = useSharedValue(false);
  const [openIcon, setOpenIcon] = useState(false);

  const onPress = () => {
    open.value = !open.value;
    const newVal = !openIcon;
    setOpenIcon(newVal);
  };
  const { exercises, setExercises } = useContext(ExercisesContext);

  const deleteExercise = (exerciseName: string) => {
    const updatedExercises = exercises.filter((exercise) => exercise.name !== exerciseName);
    setExercises(updatedExercises);
  };

  const addExerciseSet = (exerciseName: string) => {
    const newExerciseSet: Types.ExerciseSet = {
      reps: 0,
      weight: 0,
    };
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.name === exerciseName) {
        return {
          ...exercise,
          sets: [...exercise.sets, newExerciseSet],
        };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const deleteExerciseSet = (exerciseName: string, index: number) => {
    const updatedExercises = exercises.map((exercise, i) => {
      if (exercise.name === exerciseName) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, i) => i !== index),
        };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const modifyExerciseSetReps = (exerciseName: string, reps: number, index: number) => {
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.name === exerciseName) {
        exercise.sets[index].reps = reps;
        return {
          ...exercise,
          sets: [...exercise.sets],
        };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };

  const modifyExerciseSetWeight = (exerciseName: string, weight: number, index: number) => {
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.name === exerciseName) {
        exercise.sets[index].weight = weight;
        return {
          ...exercise,
          sets: [...exercise.sets],
        };
      }
      return exercise;
    });
    setExercises(updatedExercises);
  };
  return (
    <YGroup
      width={"100%"}
      separator={<Separator />}
    >
      <YGroup.Item>
        <ListItem
          justifyContent="space-between"
          backgroundColor={inCard ? "$colorTransparent" : "$background"}
        >
          {!inCard && (
            <TouchableOpacity onPress={() => deleteExercise(exercise.name)}>
              <X
                size="$1"
                col="$red10"
              />
            </TouchableOpacity>
          )}
          <XStack gap="$2">
            {inCard && (
              <View
                w={6}
                h={"$1"}
                borderRadius={"$10"}
                backgroundColor={getMuscleColor(exercise.muscle)}
              />
            )}
            <Text
              fontSize={"$4"}
              fontFamily={"$mono"}
              fontWeight={600}
              textAlign={inCard ? "left" : "center"}
              w={"85%"}
              marginHorizontal={inCard ? '$0' : "auto"}
            >
              {exercise.name}
            </Text>
          </XStack>
          <TouchableOpacity onPress={onPress}>
            <Square
              animation="quick"
              rotate={openIcon ? "180deg" : "0deg"}
            >
              <ChevronDown size="$1" />
            </Square>
          </TouchableOpacity>
        </ListItem>
      </YGroup.Item>
      <AccordionItem
        isExpanded={open}
        viewKey="i"
      >
        {exercise.sets.map((set: Types.ExerciseSet, y: number) => (
          <YGroup.Item key={y} >
            <ListItem
              paddingVertical="$0"
              justifyContent="space-between"
              backgroundColor={inCard ? "$gray2" : "$background"}
              >
              <XStack paddingVertical="$1">
                <YStack gap="$1">
                  <Text
                    fontFamily={"$mono"}
                    fontSize={"$2"}
                    opacity={0.7}
                  >
                    Reps
                  </Text>
                  <Input
                    p="$0"
                    width="$7"
                    onChangeText={(text) => {
                      modifyExerciseSetReps(exercise.name, parseInt(text) || 0, y);
                    }}
                    keyboardType="numeric"
                    borderWidth="0"
                    maxLength={3}
                    fontFamily={"$mono"}
                    placeholder="Reps"
                    value={set.reps > 0 ? set.reps.toString() : ""}
                    backgroundColor={"transparent"}
                    height={"$2"}
                  />
                </YStack>
                <YStack gap="$1">
                  <Text
                    fontFamily={"$mono"}
                    fontSize={"$2"}
                    opacity={0.7}
                  >
                    Weight
                  </Text>
                  <Input
                    p="$0"
                    width="$8"
                    onChangeText={(text) => {
                      modifyExerciseSetWeight(exercise.name, parseInt(text) || 0, y);
                    }}
                    keyboardType="numeric"
                    borderWidth="0"
                    maxLength={4}
                    fontFamily={"$mono"}
                    placeholder="Weight"
                    value={set.weight > 0 ? set.weight.toString() : ""}
                    backgroundColor={"transparent"}
                    height={"$2"}
                  />
                </YStack>
              </XStack>
              {inCard ? (
                exercise.PR === set.weight && <Text>🏆</Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    deleteExerciseSet(exercise.name, y);
                  }}
                >
                  <Trash2
                    size={"$1"}
                    color={"$red10"}
                  />
                </TouchableOpacity>
              )}
            </ListItem>
          </YGroup.Item>
        ))}
      </AccordionItem>

      {!inCard && (
        <TouchableOpacity
          onPress={() => {
            addExerciseSet(exercise.name);
            open.value = true;
            setOpenIcon(true);
          }}
        >
          <YGroup.Item>
            <ListItem
              fontFamily={"$mono"}
              color={"#00cccc"}
              fontWeight={"$15"}
            >
              Add Set
            </ListItem>
          </YGroup.Item>
        </TouchableOpacity>
      )}
    </YGroup>
  );
}

const styles = StyleSheet.create({
  parent: {
    width: 200,
  },
  wrapper: {
    width: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
  },
  animatedView: {
    width: "100%",
    overflow: "hidden",
  },
});
