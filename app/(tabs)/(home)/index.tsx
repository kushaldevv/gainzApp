import Card from "@/components/card";
import { getFollowingSessions, getUserPfp } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, Spinner, View, YStack } from "tamagui";

const emptySession : Types.Session = {
  id: " ",
  name: " ",
  user: {
    id: " ",
    name: " ",
    pfp: " "
  },
  location: " ",
  date: " ",
  exercises: [],
  duration: 0,
  comments: 0,
  likes: []
};

const Page = () => {
  const [sessions, setSessions] = useState<Types.Session[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const [loading, setLoading] = useState(true);
  const {user} = useUser();
  const [pfp, setPfp] = useState(" ");

  const fetchSessions = async () => {
    try {
      const placeHolderSessions : Types.Session[] = []
      const data = await getFollowingSessions(user?.id as string) || placeHolderSessions;
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }; 

  const fetchPFP = async () => {
    if (user) {
      setPfp(await getUserPfp(user.id));
    }
  };

  useFocusEffect(
    useCallback(() => {
      // console.log(loading)
      fetchSessions();
      setLoading(false);
      fetchPFP();
    }, [])
  );


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
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView
        width={"100%"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View gap="$2">
          {loading && <Card session={emptySession} loading={true} userPfp={pfp}/>}
          {loading && <Card session={emptySession} loading={true} userPfp={pfp}/>}
          {!loading && sessions.map((session, index) => (
            <Card key={index} session={session} loading={false} userPfp={pfp}/>
          ))}
        </View>
      </ScrollView>
    </YStack>
  );
};

export default Page;
