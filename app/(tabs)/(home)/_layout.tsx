import {Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function HomeLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor =
  colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const headerTintColor =
  colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleStyle: { color: headerTintColor },
        headerTintColor: "#ffffff",
      }}
    >
      <Stack.Screen name="index" 
      options={{
        title: 'Home',
      }}/>
      <Stack.Screen name="likes" options={{
        title: "Likes"
      }} />
    </Stack>
  );
}
