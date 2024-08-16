import Card from "@/components/home/card";
import { getFollowingSessions, getUser, getUserSessions } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, Spinner, View, YStack } from "tamagui";
import PostFAB from "@/components/home/fabPortal";
import { PaperProvider } from "react-native-paper";

const Cards = ({ userId }: { userId?: string }) => {
  const [sessions, setSessions] = useState<Types.Session[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<Types.User | null>(null);
  const [spinner, setSpinner] = useState(false);

  const fetchSessions = async () => {
    console.log("Usersessions:", userId);
    try {
      const placeHolderSessions: Types.Session[] = [];
      const data = userId
        ? await getUserSessions(userId, user?.id!)
        : (await getFollowingSessions(user?.id as string)) || placeHolderSessions;
      setSessions([...data]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
    setSpinner(false);
  };

  const fetchUserDetails = async () => {
    if (user) {
      const userDetails = await getUser(user.id);
      setUserDetails(userDetails);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchUserDetails();
    setSpinner(true);
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
    <PaperProvider>
      <YStack
        flex={1}
        alignItems="center"
        backgroundColor={"$background"}
      >
        {spinner && <Spinner marginVertical="$3" />}
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
       <PostFAB visible={userId === undefined ? true : false}/>
    </PaperProvider>
  );
};

export default Cards;
