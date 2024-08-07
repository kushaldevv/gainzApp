import { BellDot, Search, UserRoundSearch, X } from "@tamagui/lucide-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Input, useTheme, XStack, Text } from "tamagui";
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
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.gray3.val,
        },
        headerTitleStyle: { color: headerTintColor },
        headerTintColor: headerTintColor,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Exercises",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text
                fontFamily={"$mono"}
                // col={"#00cccc"}
                fontSize={"$5"}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="subView"
        options={{
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
                    placeholder="Search for exercises"
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
        }}
      />
    </Stack>
  );
}
