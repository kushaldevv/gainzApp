import Card from "@/components/card";
import { getFriendsSessions } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, View, YStack } from "tamagui";

const Page = () => {
  const [sessions, setSessions] = useState<Types.Session[]>([]);
  const [refreshing, setRefreshing] = useState(true);
  const {user} = useUser();

  const fetchSessions = async () => {
    try {
      const placeHolderSessions : Types.Session[] = []
      const data = await getFriendsSessions(user?.id as string) || placeHolderSessions;
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSessions();
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
          {sessions.map((session, index) => (
            <Card key={index} session={session} loading={false} />
          ))}
        </View>
      </ScrollView>
    </YStack>
  );
};

export default Page;
