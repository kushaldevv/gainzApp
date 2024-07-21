import Card from "@/components/card";
import { getUserSessions } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, View, YStack } from "tamagui";

const emptySession: Types.Session = {
  id: "",
  name: "",
  user: {
    id: "",
    name: "",
    pfp: " ",
  },
  location: "",
  date: "",
  exercises: [],
  duration: 0,
  comments: 0,
  likes: [],
};

const Page = () => {
  const [sessions, setSessions] = useState<Types.Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const { user } = useUser();

  const fetchSessions = async () => {
    try {
      setLoading(true);
      // const data = await getUserSessions(user?.id as string);
      const data = await getUserSessions("user_2jWjeSXTPtnTxG5aOfMoWfPrtRk");
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchSessions();
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView
        width={"100%"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View gap="$2">
          {
            sessions.map((session, index) => (
              <Card key={index} session={session} loading={loading} />
            ))
          }
        </View>
      </ScrollView>
    </YStack>
  );
};

export default Page;
