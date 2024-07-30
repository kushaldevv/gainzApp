import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor =
  colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const headerTintColor =
  colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: true,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleStyle: { color: headerTintColor },
        headerTintColor: headerTintColor,
      }}
    >
      <Stack.Screen name="index" 
      options={{
        title: 'Profile',
      }}/>
       <Stack.Screen name="following" options={{
        title: "Following",
        headerBackTitle: 'Profile',
      }} />
    </Stack>
  );
}
