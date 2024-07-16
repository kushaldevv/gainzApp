import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useColorScheme } from "react-native";
import { SignedIn, useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

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
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={25} name="plus-square" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={25} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
