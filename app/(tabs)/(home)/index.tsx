import Card from "@/components/home/card";
import { getFollowingSessions, getUser } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { ScrollView, Spinner, View, YStack } from "tamagui";
import PostFAB from "@/components/home/fabPortal";
import { PaperProvider } from "react-native-paper";

const Page = () => {
  const [sessions, setSessions] = useState<Types.Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<Types.User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      await Promise.all([fetchSessions(), fetchUserDetails()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData(true);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <PaperProvider>
      <YStack
        flex={1}
        backgroundColor={"$background"}
      >
        {isLoading ? (
            <Spinner mt = '$3' />
        ) : (
          <ScrollView
            width={"100%"}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <View gap="$2">
              {sessions.map((session, index) => (
                <Card
                  key={index}
                  session={session}
                  loading={false}
                  userDetails={userDetails}
                />
              ))}
            </View>
          </ScrollView>
        )}
        <PostFAB />
      </YStack>
    </PaperProvider>
  );
};

export default Page;