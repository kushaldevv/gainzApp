import React from "react";
import { Text } from "react-native"; // Import Text from react-native package
import Cards from "../(home)";
import { useLocalSearchParams } from "expo-router";
const Sessions = () => {
  const params = useLocalSearchParams();
  const userId = params.userID as string;
  return <Cards userId={userId} />;
};

export default Sessions;
