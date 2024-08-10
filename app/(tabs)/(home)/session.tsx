import { View, Text, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Spinner, YStack } from "tamagui";
import Card from "@/components/home/card";
import * as Types from "@/types";
import { getSpecificUserSession, getUser } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";

const skeletonSession: Types.Session = {
  id: " ",
  name: " ",
  user: {
    id: " ",
    name: " ",
    pfp: " ",
  },
  location: " ",
  date: " ",
  exercises: [],
  duration: 0,
  comments: 0,
  likes: [],
  numLikes: 0,
  userLiked: false,
};

const SessionView = () => {
  const sessionId = useLocalSearchParams().sessionIdParam as string;
  const { user } = useUser();
  const [session, setSession] = useState<Types.Session>(skeletonSession);
  const [userDetails, setUserDetails] = useState<Types.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSession();
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    if (user) {
      const userDetails = await getUser(user.id);
      setUserDetails(userDetails);
    }
  };
  const fetchSession = async () => {
    setLoading(true);
    try {
      const sessionData = await getSpecificUserSession(sessionId, user?.id as string);
      setSession(sessionData);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      console.log("refreshing");
      await fetchSession();
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
        {loading && (
          <Card
            session={skeletonSession}
            userDetails={skeletonSession.user}
            loading={true}
          />
        )}
        {!loading && (
          <Card
            session={session}
            userDetails={userDetails}
            loading={false}
          />
        )}
      </ScrollView>
    </YStack>
  );
};

export default SessionView;
