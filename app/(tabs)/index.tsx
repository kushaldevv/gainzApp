import Card from "@/components/card";
import { appendSession, getSessionLikes, getUserSessions, postUser } from "@/services/apiCalls";
import * as Types from "@/types";
import {
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, YStack } from "tamagui";

const emptySession: Types.Session = {
  id: "",
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // pass in currently logged in user's id
        const data = await getUserSessions("user_2j6mHW8GrcGU4xGOf240n7yBvT0");
        await appendSession("user_2jWjeSXTPtnTxG5aOfMoWfPrtRk", "session_2024071504", [], {}, [], "Eppley - College Park, MD", 3600, "2024-08-15T16:40:00.000Z");
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"}>
        <View gap="$2">
          {Array.from({ length: loading ? 2 : sessions.length }).map(
            (_, index) => (
              <Card
                key={index}
                session={loading ? emptySession : sessions[index]}
                loading={loading}
                bottomSheetModalRef={bottomSheetModalRef}
              />
            )
          )}
        </View>
      </ScrollView>
    </YStack>
  );
};

export default Page;
