import React, { useCallback, useEffect, useState } from "react";
import { Spacer, YStack } from "tamagui";
import UserScrollView from "@/components/home/userScrollView";
import { getUsers } from "@/services/apiCalls";
import * as Types from "@/types";
import { useLocalSearchParams } from "expo-router";

const SearchScreen = () => {
  const [userList, setUserList] = useState<Types.User[]>([]);
  const params = useLocalSearchParams();
  const { query } = params;
  const queryLower = (query as string).toLowerCase();

  const fetchUsers = useCallback(async () => {
    if (query as string) {
      try {
        const fetchedUsers = await getUsers(queryLower);
        setUserList(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  }, [query]);

  useEffect(() => {
    fetchUsers();
  }, [query]);

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      <Spacer />
      <UserScrollView
        userList={userList}
        loading={false}
      />
    </YStack>
  );
};

export default SearchScreen;
