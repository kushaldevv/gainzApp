import gainzExercises from "@/services/GainzExercises.json";
import { ChevronRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ListItem,
  ScrollView,
  View,
  YGroup
} from "tamagui";

const targetMuscles = Object.keys(gainzExercises);

const ExercisesModal = () => {

  useEffect(() => {
    console.log(targetMuscles)
  }, []);

  return (
    <View
      p="$3"
      pb="$5"
      backgroundColor={"$gray3"}
    >
      <ScrollView borderRadius={"$3"}>
        <YGroup
          alignSelf="center"
          size="$5"
        >
          {targetMuscles.map((target, i) => (
            <YGroup.Item key={i}>
              <ListItem
                pressStyle={{ backgroundColor: "$gray2" }}
                fontFamily={"$mono"}
                iconAfter={ChevronRight}
                backgroundColor={"$gray5"}
                onPress={() => {
                  router.push({
                    pathname: "subView",
                    params: {
                      exercise: target,
                    },
                  });
                  // handleDismissModalPress();
                }}
              >
                {target}
              </ListItem>
            </YGroup.Item>
          ))}
        </YGroup>
      </ScrollView>
    </View>
  );
};

export default ExercisesModal;
