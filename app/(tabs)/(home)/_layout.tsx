import { BellDot, Search, UserRoundSearch, X } from "@tamagui/lucide-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Input, useTheme, XStack } from "tamagui";
export default function HomeLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const backgroundColor = colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const headerTintColor = colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";
  const [query, setQuery] = useState("");

  const handleChange = (text: string) => {
    setQuery(text);
    router.setParams({ query: text });
  };
  const handleSearchPress = () => {
    router.push({ pathname: "/search", params: { query } });
  };
  const handleNotiPress = () => {
    router.push({ pathname: "/notis" });
  };

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleStyle: { color: headerTintColor },
        headerTintColor: headerTintColor,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
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
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          headerShown: true,
          headerTitle: () => (
            <XStack
              alignItems="center"
              justifyContent="center"
              r="$4"
              mr="$8"
            >
              <Input
                flex={1}
                pl="$8"
                backgroundColor={"$gray4"}
                textContentType="name"
                fontFamily={"$mono"}
                placeholder="Search for people on BondFit"
                borderRadius="$10"
                returnKeyType="search"
                value={query}
                onChangeText={(text) => handleChange(text)}
                height={"$4"}
              />
              <Search
                size="$1"
                position="absolute"
                left="$4"
              />
              <TouchableOpacity
                onPress={() => {
                  handleChange("");
                }}
                style={{ position: "absolute", right: 18 }}
              >
                <X size="$1.5" />
              </TouchableOpacity>
            </XStack>
          ),
          headerBackTitleVisible: false,
          headerStyle: { backgroundColor: theme.background.val },
        }}
      />
      <Stack.Screen
        name="notis"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="likes"
        options={{
          title: "Likes",
        }}
      />
      <Stack.Screen
        name="(post)"
        options={{
          title: "Post",
        }}
      />
      <Stack.Screen
        name="[user]"
        options={{
          title: "Profile",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="followers"
        options={{
          title: "Followers",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="following"
        options={{
          title: "Following",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="session"
        options={{
          title: "Session",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
