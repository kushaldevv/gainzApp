import { Mail } from '@tamagui/lucide-icons';
import React from 'react'
import { View, Text, XStack, Input, YStack } from 'tamagui';
// hey
import {
    Search
} from "@tamagui/lucide-icons";
import * as Types from "@/types";
import UserScrollView from '@/components/userScrollView';

const userList: Types.User[] = [
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
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <XStack padding={'$3'}>
      <Input
        flex={1}
        pl="$7"
        textContentType='name'
        placeholder="Search for people on BondFit"
        borderColor={"$borderColor"}
        focusStyle={{
          borderColor: "$borderColor",
        }}
      />
      <Search size={"$1"} alignSelf="center" pos={"absolute"} ml="$5" />
    </XStack>
    <UserScrollView userList={userList}/>
  </YStack>
  )
}

export default SearchScreen;

