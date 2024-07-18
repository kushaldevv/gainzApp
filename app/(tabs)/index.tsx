import Card from "@/components/card";
import { getUser } from "@/services/apiCalls";
import * as Types from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { ScrollView, View, YStack } from "tamagui";

// For testing purposes -----------------------//
const user: Types.User = {
  id: "user_2j6mHW8GrcGU4xGOf240n7yBvT0",
  name: "Leul Mesfin",
  pfp: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
};

const exerciseSet1: Types.ExerciseSet = {
  reps: 6,
  weight: 135,
};

const exerciseSet2: Types.ExerciseSet = {
  reps: 8,
  weight: 205,
};

const exerciseSet3: Types.ExerciseSet = {
  reps: 8,
  weight: 215,
};

const exercise: Types.Exercise = {
  name: "Back Squat",
  sets: [exerciseSet1, exerciseSet2, exerciseSet3],
};

const comment1: Types.Comment = {
  user: user,
  date: new Date(),
  body: "Great job!",
  likes: 12,
};

const comment2: Types.Comment = {
  user: user,
  date: new Date(),
  body: "Keep it up!",
  likes: 123,
};

const comment3: Types.Comment = {
  user: user,
  date: new Date(),
  body: "You got this!",
  likes: 9,
};

const session: Types.Session = {
  id: "1",
  user: user,
  location: "Golds Gym - Frederick, MD",
  date: new Date().toISOString(),
  exercises: [exercise, exercise, exercise],
  sessionTime: 6022,
  comments: [comment1, comment2, comment3],
  likes: [user, user, user, user],
};
// ------------------------------------------------- //

export default function Page() {
  // Building the bottom sheet modal
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const fetchUser = async () => {
    try {
      const user = await getUser("user_2j6mHW8GrcGU4xGOf240n7yBvT0");
      console.log("Fetched single user:", user);
    } catch (err) {
      console.error("Error fetching single user:", err);
    }
  };
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"}>
        <View gap="$2">
          <Card session={session} bottomSheetModalRef={bottomSheetModalRef} />
          <Card session={session} bottomSheetModalRef={bottomSheetModalRef} />
          <Card session={session} bottomSheetModalRef={bottomSheetModalRef} />
        </View>
      </ScrollView>
    </YStack>
  );
}
