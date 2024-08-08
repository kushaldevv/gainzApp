import { useClerk, useUser } from "@clerk/clerk-expo";
import { LogOut, Type } from "@tamagui/lucide-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Circle, Spinner } from "tamagui";
import * as Types from "@/types";

export const ProfileContext = createContext<Types.UserProfileContextType>({
  userId: "",
  setUserId: () => {},
});

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const headerTintColor = colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";
  const { signOut } = useClerk();
  const [showSpinner, setShowSpinner] = useState(false);
  const { user } = useUser();
  const [userId, setUserId] = useState('');
  return (
    <ProfileContext.Provider value={{ userId, setUserId }}>
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
            title: "Profile",
            headerRight: () =>
              userId == user?.id && (
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
                      col="$red10"
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
    </ProfileContext.Provider>
  );
}
