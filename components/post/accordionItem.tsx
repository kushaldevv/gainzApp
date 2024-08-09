import { ChevronDown, Trash2, X } from "@tamagui/lucide-icons";
import React, { useContext, useState } from "react";
import { StyleSheet, View, Button, SafeAreaView, TouchableOpacity } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ListItem, YGroup, Text, XStack, YStack, Input, Square, Separator } from "tamagui";
import * as Types from "@/types";
import { ExercisesContext } from "@/app/(tabs)/(home)/(post)/_layout";

function AccordionItem({
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

export default function ExerciseAccordion({ exercise }: { exercise: Types.ExerciseViewProp }) {
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
    const newExerciseSet: Types.ExerciseSetViewProp = {
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
          pl="$3"
          justifyContent="space-between"
        >
          <TouchableOpacity onPress={()=>deleteExercise(exercise.name)}>
            <X size="$1" />
          </TouchableOpacity>
          <Text
            fontSize={"$4"}
            fontFamily={"$mono"}
            fontWeight={600}
            textAlign="center"
            w={"60%"}
          >
            {exercise.name}
          </Text>
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
        {exercise.sets.map((set: Types.ExerciseSetViewProp, y: number) => (
          <YGroup.Item key={y}>
            <ListItem p="$0">
              <XStack
                alignItems="center"
                justifyContent="space-between"
              >
                <YStack>
                  <Text
                    fontFamily={"$mono"}
                    pl="$3"
                    pt="$1"
                    pb="$0"
                    fontSize={"$2"}
                    opacity={0.7}
                  >
                    Reps
                  </Text>
                  <Input
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
                  />
                </YStack>
                <YStack>
                  <Text
                    fontFamily={"$mono"}
                    pl="$4"
                    pt="$1"
                    pb="$0"
                    fontSize={"$2"}
                    opacity={0.7}
                  >
                    Weight
                  </Text>
                  <Input
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
                  />
                </YStack>
              </XStack>
              <TouchableOpacity
                style={{ position: "absolute", right: 10 }}
                onPress={() => {
                  deleteExerciseSet(exercise.name, y);
                }}
              >
                <Trash2
                  size={"$1"}
                  color={"$red10"}
                />
              </TouchableOpacity>
            </ListItem>
          </YGroup.Item>
        ))}
      </AccordionItem>

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
    </YGroup>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 24,
  },
  buttonContainer: {
    flex: 1,
    paddingBottom: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  box: {
    height: 120,
    width: 120,
    color: "#f8f9ff",
    backgroundColor: "#b58df1",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
