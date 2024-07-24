import {Stack, router} from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import {
  UserRoundSearch, Search, BellDot
} from "@tamagui/lucide-icons";

export default function HomeLayout() {
  
  const colorScheme = useColorScheme();
  const backgroundColor =
  colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const headerTintColor =
  colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";

  const handleSearchPress = () => {
    router.push('/search');
  }
  const handleNotiPress = () => {
    router.push('/notis');
  }

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
        title: 'Home',
        headerLeft: () => (
          <TouchableOpacity onPress={handleSearchPress}>
            <UserRoundSearch 
              size="$1.5"
              color={headerTintColor} 
              ml="$1"
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={handleNotiPress}>
            <BellDot 
              size="$1.5"
              color={headerTintColor} 
              mr="$1"
            />
          </TouchableOpacity>
        ),
      }}/>
       <Stack.Screen name="search" options={{
        title: "Search",
        headerBackTitle: 'Home',
      }} />
      <Stack.Screen name="notis" options={{
        title: "Notifications",
        headerBackTitle: 'Home', 
      }} />
      <Stack.Screen name="likes" options={{
        title: "Likes"
      }} />
    </Stack>
  );
}
