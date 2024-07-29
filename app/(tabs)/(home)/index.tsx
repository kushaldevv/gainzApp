import Card from "@/components/card";
import { getFollowingSessions, getUser } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, View, YStack } from "tamagui";

// const emptySession: Types.Session = {
//   id: " ",
//   name: " ",
//   user: {
//     id: " ",
//     name: " ",
//     pfp: " ",
//   },
//   location: " ",
//   date: " ",
//   exercises: [],
//   duration: 0,
//   comments: 0,
//   likes: [],
//   numLikes: 0,
// };

const Page = () => {
  const [sessions, setSessions] = useState<Types.Session[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<Types.User | null>(null);

  const fetchSessions = async () => {
    try {
      const placeHolderSessions: Types.Session[] = [];
      const data = (await getFollowingSessions(user?.id as string)) || placeHolderSessions;
      setSessions([...data]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  };

  const fetchUserDetails = async () => {
    if (user) {
      const userDetails = await getUser(user.id);
      setUserDetails(userDetails);
      console.log("set user details");
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchUserDetails();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      console.log("refreshing");
      await fetchSessions();
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      <ScrollView
        width={"100%"}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View gap="$2">
          {!refreshing &&
            sessions.map((session, index) => (
              <Card
                key={index}
                session={session}
                loading={false}
                userDetails={userDetails}
              />
            ))}
        </View>
      </ScrollView>
    </YStack>
  );
};

export default Page;
