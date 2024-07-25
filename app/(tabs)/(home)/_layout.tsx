import { Stack, router } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import { UserRoundSearch, Search, BellDot, X } from "@tamagui/lucide-icons";
import { Input, useTheme, XStack } from "tamagui";
import { useState } from "react";

export default function HomeLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
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
    router.push("/notis");
  };

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
          title: "Search",
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
          headerBackTitle: "Home",
        }}
      />
      <Stack.Screen
        name="likes"
        options={{
          title: "Likes",
        }}
      />
    </Stack>
  );
}
