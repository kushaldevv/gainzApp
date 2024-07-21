import React, { useState } from "react";
import { Text, YStack, Button, Input, XStack } from "tamagui";

const Post = () => {
  const [sessionName, setSessionName] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(0);

  const [exerciseName, setExerciseName] = useState("");
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);

  const postSession = () => {
    console.log("Posting session...");
    const sessionId = `session_${new Date().getTime()}`;
    const newSession  = {
      'likes': [],
      'comments': [],
      'date': new Date().toISOString(),
      'duration': duration,
      'exercises': {
        [exerciseName]: {
          'reps': [reps],
          'weight': [weight],
        },
      },
      'location': location,
    };
  };
  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
      gap={"$4"}
      pt={"$4"}
    >
      <Input
        onChangeText={(text) => setSessionName(text)}
        placeholder="Session name"
      />
      <Input
        onChangeText={(text) => setLocation(text)}
        placeholder="Location"
      />
      <Input
        onChangeText={(text) => setExerciseName(text)}
        placeholder="Exercise name"
      />
      <XStack gap="$5">
        <Input
          onChangeText={(text) => setReps(parseInt(text))}
          placeholder="Reps: "
        />
        <Input
          onChangeText={(text) => setWeight(parseInt(text))}
          placeholder="Weight: "
        />
      </XStack>
      <Input
        inputMode="numeric"
        onChangeText={(text) => setDuration(parseInt(text))}
        placeholder="Duration"
      />
      <Button themeInverse onPress={postSession}>
        Mickey Post
      </Button>
    </YStack>
  );
};

export default Post;
