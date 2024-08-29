import Card from "@/components/home/card";
import { getSessions, getUser } from "@/services/apiCalls";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";
import { Dimensions, RefreshControl } from "react-native";
import {Text, Button, Input, ScrollView, Spinner, View, YStack } from "tamagui";
import PostFAB from "@/components/home/fabPortal";
import { PaperProvider } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import axios from "axios";

const Cards = ({ userId }: { userId?: string }) => {
  const [sessions, setSessions] = useState<Types.Session[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<Types.User | null>(null);
  const [spinner, setSpinner] = useState(false);

  const fetchSessions = async () => {
    try {
      const placeHolderSessions: Types.Session[] = [];
      const data =
        (userId
          ? await getSessions(userId as string, false, user?.id as string)
          : await getSessions(user?.id as string, true, user?.id as string)) || [];
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
        

        {!refreshing &&
        <View flex={1} h={Dimensions.get("screen").height} w={Dimensions.get("screen").width}>
          <FlashList
          data = {sessions}
            renderItem = {({item}) => (
              <Card session={item} loading={false} userDetails={userDetails} />
            )}
            estimatedItemSize={5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >

          </FlashList>
          </View>
        }
        {/* <ScrollView
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
        </ScrollView> */}
      </YStack>
      <PostFAB visible={userId === undefined ? true : false} />
    </PaperProvider>
  );
};

export default Cards;
