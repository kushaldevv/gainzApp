import { useClerk, useUser } from "@clerk/clerk-expo";
import { LogOut } from "@tamagui/lucide-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Circle, Spinner } from "tamagui";

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const headerTintColor = colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";
  const { signOut } = useClerk();
  const [showSpinner, setShowSpinner] = useState(false);
  const {user} = useUser();
  const params = useLocalSearchParams()

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
        name="[user]"
        options={{
          title: params.userIdParam as string || "Profile",
          headerRight: () => (!params.userIdParam) && ( 
            <TouchableOpacity
              style={{ zIndex: 1, position: "absolute", right: 13, marginVertical: 13 }}
              onPress={() => {
                signOut();
                setShowSpinner(true);
              }}
            >

                {showSpinner ? (
                  <Spinner size="small" />
                ) : (
                  <LogOut
                    size={"$1.5"}
                    color={headerTintColor}
                    mr="$1"
                  />
                )}
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="following"
        options={{
          title: "Following",
        }}
      />
      <Stack.Screen
        name="followers"
        options={{
          title: "Followers",
        }}
      />
    </Stack>
  );
}
