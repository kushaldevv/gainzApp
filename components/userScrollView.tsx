import React from 'react';
import { Avatar, ScrollView, SizableText, XStack, Button } from 'tamagui';
import * as Types from "@/types";

const UserScrollView = ({userList} : Types.UserScrollViewProps) => {
  return (
    <ScrollView width={"100%"}>
        {userList.map((like: Types.User) => (
          <XStack
            key={like.id}
            padding="$3"
            alignItems="center"
            justifyContent="space-between"
          >
            <XStack flex={1} alignItems="center" mr="$3">
              <Avatar circular size="$4.5">
                <Avatar.Image src={like.pfp} />
                <Avatar.Fallback backgroundColor="$blue10" />
              </Avatar>
              <SizableText
                size={"$4"}
                fontFamily={"$mono"}
                fontWeight={700}
                ml="$3"
              >
                {like.name}
              </SizableText>
            </XStack>
            <Button
              themeInverse
              height={"$3"}
              width={"$9"}
              pressStyle={{
                backgroundColor: "$gray7",
                borderColor: "$borderColorFocus",
              }}
            >
              Follow
            </Button>
          </XStack>
        ))}
      </ScrollView>
  )
}

export default UserScrollView;