import { SignedIn, useAuth } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from '@expo/vector-icons/Entypo';
import {
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return (
    <SignedIn>
      <TabsProvider />
    </SignedIn>
  );
}

function TabsProvider() {
  const colorScheme = useColorScheme();
  const backgroundColor =
    colorScheme == "dark" ? "rgb(15,15,15)" : "rgb(250,250,250)";
  const tabBarTintColor =
    colorScheme == "dark" ? "rgb(255,255,255)" : "rgb(18,18,18)";
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: backgroundColor,
              borderTopWidth: 0,
            },
            tabBarInactiveTintColor: tabBarTintColor,
            tabBarActiveTintColor: "#00cccc",

            headerStyle: {
              backgroundColor: backgroundColor,
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTitleStyle: { color: tabBarTintColor },
            headerTintColor: "#ffffff",
          }}
        >
          <Tabs.Screen
            name="(home)"
            options={{
              headerShown: false,
              title: "Home",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="home" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="stats"
            options={{
              title: "Statistics",
              tabBarIcon: ({ color }) => (
                <Entypo size={24} name="bar-graph" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              headerShown: false,
              title: "Profile",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={25} name="user" color={color} />
              ),
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
