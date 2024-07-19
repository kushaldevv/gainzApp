import Card from "@/components/card";
import { getUser, getUserSessions } from "@/services/apiCalls";
import * as Types from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, YStack, Button } from "tamagui";

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
  comments: [],
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
        const data = await getUserSessions("user_2j6mHW8GrcGU4xGOf240n7yBvT0");
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
