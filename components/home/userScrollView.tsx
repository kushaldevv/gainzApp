import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, ScrollView, SizableText, XStack, Button, View, Text } from "tamagui";
import * as Types from "@/types";
import { Skeleton } from "moti/skeleton";
import { TouchableOpacity, useColorScheme } from "react-native";
import { appendFollowing, getUserFollowingList } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";
import { router, usePathname } from "expo-router";

const UserScrollView = ({
  userList,
  loading,
  notisContent,
  followingScreen,
}: Types.UserScrollViewProps) => {
  const loggedInUser = useUser().user?.id;
  const skeletonColorScheme = useColorScheme() == "dark" ? "dark" : "light";
  const [following, setFollowing] = useState<string[] | null>(null);
  const [followingLoading, setFollowingLoading] = useState(false);

  useEffect(() => {
    fetchFollowingList();
  }, []);

  const fetchFollowingList = async () => {
    setFollowingLoading(true);
    try {
      if (loggedInUser) {
        const data = await getUserFollowingList(loggedInUser);
        setFollowing(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setFollowingLoading(false);
    }
  };

  const postFollow = async (followingID: string) => {
    try {
      await appendFollowing(loggedInUser!, followingID);
      setFollowing((prev) => [...prev|| '', followingID]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  const pathname = usePathname();

  const renderUser = useCallback(
    (user: Types.User, index: number) => {
      const alreadyFollowing = following?  followingScreen || following?.includes(user.id) : null;
      const notiType = notisContent ? notisContent[index]?.type : null;
      const notiDate = notisContent ? notisContent[index]?.date : null;
      const showButton = notisContent ? notiType === Types.NotiType.FOLLOW_REQUEST : true;
      return (
        <Skeleton.Group
          show={loading || followingLoading}
          key={index}
        >
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
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: pathname.includes("/profile") ? "profile/[user]" : "(home)/[user]",
                      params: {
                        userIdParam: user.id,
                      },
                    });
                  }}
                >
                  <Avatar
                    circular
                    size="$4"
                  >
                    <Avatar.Image src={user.pfp} />
                    <Avatar.Fallback backgroundColor="$blue10" />
                  </Avatar>
                </TouchableOpacity>
              </Skeleton>
              <View ml="$3">
                <Skeleton
                  height={18}
                  width={120}
                  colorMode={skeletonColorScheme}
                >
                  <SizableText
                    size={"$3"}
                    fontFamily={"$mono"}
                    fontWeight={700}
                  >
                    {user.name}
                  </SizableText>
                </Skeleton>
                {notisContent && !loading && (
                  <SizableText
                    size={"$3"}
                    lineHeight={"$1"}
                    fontFamily={"$mono"}
                  >
                    {notiBody(notiType!)}
                  </SizableText>
                )}
                {notisContent && !loading && (
                  <SizableText
                    size="$3"
                    fontFamily="$mono"
                    col={"$gray10"}
                    lineHeight={"$1"}
                  >
                    {notiDate ? `${formatSimpleDate(notiDate)}` : " "}
                  </SizableText>
                )}
              </View>
            </XStack>
            {showButton && loggedInUser != user.id ? (
              <Skeleton
                colorMode={skeletonColorScheme}
                height={32}
                width={95}
                show = {loading || followingLoading || alreadyFollowing == null}
              >
                {alreadyFollowing != null ?  <Button
                  disabled={alreadyFollowing}
                  themeInverse={!(alreadyFollowing)}
                  height={"$2.5"}
                  fontSize={"$2"}
                  fontFamily={"$mono"}
                  fontWeight={600}
                  borderColor={"$borderColor"}
                  pressStyle={{
                    backgroundColor: "$gray7",
                    borderColor: "$borderColorFocus",
                  }}
                  onPress={() => postFollow(user.id)}
                  width={95}
                >
                  {alreadyFollowing ? "Following" : "Follow"}
                </Button> : null}
              </Skeleton>
            ) : null}
          </XStack>
        </Skeleton.Group>
      );
    },
    [postFollow, skeletonColorScheme, loading]
  );

  const memoizedUserList = useMemo(() => userList, [userList]);

  return <ScrollView width={"100%"}>{memoizedUserList?.map(renderUser)}</ScrollView>;
};

export default UserScrollView;

function formatSimpleDate(isoString: string): string {
  const likeDate = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - likeDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w`;
}

function notiBody(notiType: Types.NotiType): string {
  switch (notiType) {
    case Types.NotiType.FOLLOW_REQUEST:
      return "Started following you";
    case Types.NotiType.SESSION_LIKE:
      return "Liked your workout";
    case Types.NotiType.SESSION_COMMENT:
      return "Commented on your workout";
    case Types.NotiType.SESSION_FEEDBACK:
      return "Great job on your workout";
    default:
      return " ";
  }
}
