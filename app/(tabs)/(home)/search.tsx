import { Mail } from '@tamagui/lucide-icons';
import React, { useEffect, useState } from 'react';
import { Button, Input, Spacer, Text, View, XStack, YStack } from 'tamagui';

import UserScrollView from '@/components/userScrollView';
import * as Types from "@/types";
import {
  Search
} from "@tamagui/lucide-icons";
import { useLocalSearchParams } from 'expo-router';
import { getUsers } from '@/services/apiCalls';

const suggestedUsers: Types.User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    pfp: "https://example.com/pfp/alice.jpg"
  },
  {
    id: "2",
    name: "Bob Smith",
    pfp: "https://example.com/pfp/bob.jpg"
  },
  {
    id: "3",
    name: "Charlie Brown",
    pfp: "https://example.com/pfp/charlie.jpg"
  },
  {
    id: "4",
    name: "Diana Ross",
    pfp: "https://example.com/pfp/diana.jpg"
  },
  {
    id: "5",
    name: "Ethan Hunt",
    pfp: "https://example.com/pfp/ethan.jpg"
  },
  {
    id: "6",
    name: "Fiona Apple",
    pfp: "https://example.com/pfp/fiona.jpg"
  },
  {
    id: "7",
    name: "George Michael",
    pfp: "https://example.com/pfp/george.jpg"
  },
  {
    id: "8",
    name: "Hannah Montana",
    pfp: "https://example.com/pfp/hannah.jpg"
  },
  {
    id: "9",
    name: "Ian McKellen",
    pfp: "https://example.com/pfp/ian.jpg"
  },
  {
    id: "10",
    name: "Julia Roberts",
    pfp: "https://example.com/pfp/julia.jpg"
  }
];

const SearchScreen = () => {
  const [userList, setUserList] = useState<Types.User[]>(suggestedUsers);
  const params = useLocalSearchParams();
  const { query }  = params;
  const queryLower = (query as string).toLowerCase();

  useEffect(() => {
    const fetchUsers = async () => {
      if (query as string) {
        try {
          const fetchedUsers = await getUsers(queryLower);
          setUserList(fetchedUsers);
          console.log(fetchedUsers);
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
    <UserScrollView userList={userList} loading={false}/>
  </YStack>
  )
}

export default SearchScreen;

