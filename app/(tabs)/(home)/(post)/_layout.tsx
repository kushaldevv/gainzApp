import { router, Stack } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Text, useTheme } from "tamagui";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createContext, useState } from "react";
import * as Types from "@/types";

export const ExercisesContext = createContext<Types.ExercisesContextType>({
  exercises: [],
  setExercises: () => {},
});

export default function PostLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const headerTintColor = colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";
  const theme = useTheme();

  const [exercises, setExercises] = useState<Types.Exercise[]>([]);
  return (
    <ExercisesContext.Provider value={{ exercises, setExercises }}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTintColor: headerTintColor,
        }}
      >
        <Stack.Screen name="manual" />

        <Stack.Screen
          name="(exercisesModal)"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen name="live" />
      </Stack>
    </ExercisesContext.Provider>
  );
}
