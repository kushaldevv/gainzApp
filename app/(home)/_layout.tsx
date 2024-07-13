import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "rgb(18,22,29)",
        },
        tabBarInactiveTintColor: "rgb(200,200,200)",
        tabBarActiveTintColor: "rgb(53, 132, 249)",

        headerStyle: {
          backgroundColor: "rgb(18,22,29)",
        },
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