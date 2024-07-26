import React, { useCallback, useEffect, useState } from 'react';
import { Spacer, YStack } from 'tamagui';

import UserScrollView from '@/components/userScrollView';
import { getUsers } from '@/services/apiCalls';
import * as Types from "@/types";
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

const SearchScreen = () => {
  const {user} = useUser();
  const [userList, setUserList] = useState<Types.User[]>([]);
  const params = useLocalSearchParams();
  const { query, followingListParam }  = params;
  const queryLower = (query as string).toLowerCase();
  const followingList = JSON.parse(followingListParam as string) as string[];

  const fetchUsers = useCallback(async () => {
    if (query as string) {
      try {
        const fetchedUsers = await getUsers(queryLower);
        setUserList(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }, [query, user?.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
 
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <Spacer/>
    <UserScrollView userList={userList} followingList={followingList} loading={false}/>
  </YStack>
  )
}

export default SearchScreen;

