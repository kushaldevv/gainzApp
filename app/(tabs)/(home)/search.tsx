import React, { useEffect, useState } from 'react';
import { Spacer, YStack } from 'tamagui';

import UserScrollView from '@/components/userScrollView';
import { getUsers } from '@/services/apiCalls';
import * as Types from "@/types";
import { useLocalSearchParams } from 'expo-router';

const SearchScreen = () => {
  const [userList, setUserList] = useState<Types.User[]>([]);
  const params = useLocalSearchParams();
  const { query }  = params;
  const queryLower = (query as string).toLowerCase();

  useEffect(() => {
    const fetchUsers = async () => {
      if (query as string) {
        try {
          const fetchedUsers = await getUsers(queryLower);
          setUserList(fetchedUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [query as string]);
 
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <Spacer/>
    <UserScrollView followers={userList} following={[]} loading={false}/>
  </YStack>
  )
}

export default SearchScreen;

