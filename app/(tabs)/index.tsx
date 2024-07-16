import { YStack } from "tamagui";
import React from "react";
import { ScrollView, View } from "tamagui";
import * as Types from "@/types";
import { Card } from "@/components/card";
// For testing purposes -----------------------//

const user: Types.User = {
  id: "1",
  name: "Leul Mesfin",
  pfp: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
};

const exerciseSet1: Types.ExceriseSet = {
  reps: 6,
  weight: 135,
};

const exerciseSet2: Types.ExceriseSet = {
  reps: 8,
  weight: 205,
};

const exerciseSet3: Types.ExceriseSet = {
  reps: 8,
  weight: 215,
};

const exercise: Types.Excerise = {
  name: "Back Squat",
  sets: [exerciseSet1, exerciseSet2, exerciseSet3],
};
const session: Types.Session = {
  id: "1",
  user: user,
  location: "Golds Gym - Frederick, MD",
  date: new Date(),
  exercies: [exercise, exercise, exercise],
  sessionTime: 6022,
  comments: ["Great job!", "Keep it up!", "You got this!"],
  likes: [
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
    "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
  ],
};
// ------------------------------------------------- //
export default function Page() {
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"}>
        <View gap="$2">
          <Card session={session} />
          <Card session={session} />
          <Card session={session} />
        </View>
      </ScrollView>
    </YStack>
  );
}
