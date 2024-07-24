import React from "react";
import { Avatar, ScrollView, SizableText, XStack, Button, View } from "tamagui";
import * as Types from "@/types";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";

const UserScrollView = ({
  userList,
  loading,
}: Types.UserScrollViewProps) => {
  const skeletonColorScheme =
    useColorScheme() == "dark" ? "light" : "dark" || "light";
  return (
    <ScrollView width={"100%"}>
      {userList.map((user: Types.User, index: number) => (
        <Skeleton.Group show={loading} key={index}>
          <XStack
            padding="$3"
            alignItems="center"
            justifyContent="space-between"
          >
            <XStack
              flex={1}
              alignItems="center"
              mr="$3"
            >
              <Skeleton
                radius="round"
                colorMode={skeletonColorScheme}
              >
                <Avatar
                  circular
                  size="$4.5"
                >
                  <Avatar.Image src={user.pfp} />
                  <Avatar.Fallback backgroundColor="$blue10" />
                </Avatar>
              </Skeleton>
              <View ml="$3">
                <Skeleton
                  height={18}
                  width={120}
                  colorMode={skeletonColorScheme}
                >
                  <SizableText
                    size={"$4"}
                    fontFamily={"$mono"}
                    fontWeight={700}
                  >
                    {user.name}
                  </SizableText>
                </Skeleton>
              </View>
            </XStack>
            <Skeleton
              colorMode={skeletonColorScheme}
              height={32}
            >
              <Button
                themeInverse
                height={"$2.5"}
                width={"$9"}
                pressStyle={{
                  backgroundColor: "$gray7",
                  borderColor: "$borderColorFocus",
                }}
              >
                Follow
              </Button>
            </Skeleton>
          </XStack>
        </Skeleton.Group>
      ))}
    </ScrollView>
  );
};

export default UserScrollView;
