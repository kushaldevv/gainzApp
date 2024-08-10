import CustomBackdrop from "@/components/home/backdrop";
import DropDownMenu from "@/components/post/dropDownMenu";
import { daysFull, formatSessionDate } from "@/services/utilities";
import * as Types from "@/types";
import { BottomSheetModal, BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { ChevronRight, Search, Trash2, X } from "@tamagui/lucide-icons";
import React, { useCallback, useRef, useState } from "react";
import DatePicker from "react-native-date-picker";
import {
  Input,
  ListItem,
  ScrollView,
  Separator,
  Text,
  useTheme,
  XStack,
  YGroup,
  YStack,
  View,
} from "tamagui";
import gainzExercises from "@/services/GainzExercises.json";
import { router, Stack } from "expo-router";

const targetMuscles = Object.keys(gainzExercises);

const exerciseSet1: Types.ExerciseSetViewProp = {
  reps: 12,
  weight: 189,
};
const exerciseSet2: Types.ExerciseSetViewProp = {
  reps: 8,
  weight: 200,
};

const exercise: Types.ExerciseViewProp = {
  name: "Back Squat",
  sets: [exerciseSet1],
};

const ExercisesModal = () => {
  return (
    <View
      p="$3"
      pb="$5"
      backgroundColor={"$gray3"}
    >
      <ScrollView
        borderRadius={"$3"}
      >
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
