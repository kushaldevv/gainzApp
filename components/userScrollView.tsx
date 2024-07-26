import React, { useCallback, useMemo, useState } from "react";
import { Avatar, ScrollView, SizableText, XStack, Button, View } from "tamagui";
import * as Types from "@/types";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";
import { appendFollowing } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";

const UserScrollView = ({
  userList,
  followingList,
  loading,
  notisContent,
}: Types.UserScrollViewProps) => {
  const { user } = useUser();
  const skeletonColorScheme = useColorScheme() === "dark" ? "light" : "dark";
  const [followingState, setFollowingState] = useState<Set<string>>(new Set(followingList));
  const isFollowingScreen = !followingList;

  const isFollowing = useCallback((userId: string) => followingState.has(userId), [followingState]);

  const postFollow = useCallback(
    async (followingID: string) => {
      try {
        await appendFollowing(user?.id!, followingID);
        setFollowingState((prev) => new Set(prev).add(followingID));
      } catch (error) {
        console.error("Error following user:", error);
      }
    },
    [user?.id]
  );

  const renderUser = useCallback(
    (user: Types.User, index: number) => {
      const alreadyFollowing = isFollowing(user.id);
      const notiType = notisContent ? notisContent[index]?.type : null;
      const notiDate = notisContent ? notisContent[index]?.date : null;
      const showButton = notisContent ? notiType === Types.NotiType.FOLLOW_REQUEST : true;

      return (
        <Skeleton.Group
          show={loading}
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
                <Avatar
                  circular
                  size="$4"
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
                    // fontFamily={"$mono"}
                    lineHeight={"$1"}
                  >
                    {notiBody(notiType!)}
                  </SizableText>
                )}
                {notisContent && !loading && (
                  <SizableText
                    size="$3"
                    // fontFamily="$mono"
                    col={"$gray10"}
                    lineHeight={"$1"}
                  >
                    {notiDate ? `${formatSimpleDate(notiDate)}` : " "}
                  </SizableText>
                )}
              </View>
            </XStack>
            {showButton ? (
              <Skeleton
                colorMode={skeletonColorScheme}
                height={32}
              >
                <Button
                  disabled={isFollowingScreen || alreadyFollowing}
                  themeInverse={!(isFollowingScreen || alreadyFollowing)}
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
                >
                  {isFollowingScreen || alreadyFollowing ? "Following" : "Follow"}
                </Button>
              </Skeleton>
            ) : null}
          </XStack>
        </Skeleton.Group>
      );
    },
    [isFollowing, postFollow, skeletonColorScheme, loading, isFollowingScreen]
  );

  const memoizedUserList = useMemo(() => userList, [userList]);

  return <ScrollView width={"100%"}>{memoizedUserList?.map(renderUser)}</ScrollView>;
};

export default UserScrollView;
// import React, { useCallback, useMemo, useState } from "react";
// import { Avatar, ScrollView, SizableText, XStack, Button, View } from "tamagui";
// import * as Types from "@/types";
// import { Skeleton } from "moti/skeleton";
// import { useColorScheme } from "react-native";
// import { appendFollowing } from "@/services/apiCalls";
// import { useUser } from "@clerk/clerk-expo";

// enum ScreenType {
//   FOLLOWING,
//   FOLLOWERS,
//   NOTIS,
// }

// const UserScrollView = ({
//   userList,
//   followingList,
//   notisContent,
//   loading,
// }: Types.UserScrollViewProps) => {
//   const { user } = useUser();
//   const skeletonColorScheme = useColorScheme() === "dark" ? "light" : "dark";
//   const isFollowingScreen = !followingList;
//   const [followingState, setFollowingState] = useState<string[]>(followingList || []);

//   const isFollowing = useCallback(
//     (userId: string) => followingState.includes(userId),
//     [followingState.length]
//   );

//   const postFollow = async (followingID: string) => {
//     try {
//       await appendFollowing(user?.id!, followingID);
//       setFollowingState((prev) => [...prev, followingID]);
//     } catch (error) {
//       console.error("Error following user:", error);
//     }
//   };

//   const renderUser = useCallback(
//     (user: Types.User, index: number) => {
//       const alreadyFollowing = (isFollowing(user.id), [isFollowing]);
//       const notiType = notisContent ? notisContent[index]?.type : null;
//       const notiDate = notisContent ? notisContent[index]?.date : null;
//       const showButton = notisContent ? notiType === Types.NotiType.FOLLOW_REQUEST : true;
//       return (
//         <Skeleton.Group
//           show={loading}
//           key={index}
//         >
//           <XStack
//             padding="$3"
//             pb="$1.5"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             <XStack
//               flex={1}
//               alignItems="center"
//               mr="$3"
//             >
//               <Skeleton
//                 radius="round"
//                 colorMode={skeletonColorScheme}
//               >
//                 <Avatar
//                   circular
//                   size="$4"
//                 >
//                   <Avatar.Image src={user.pfp} />
//                   <Avatar.Fallback backgroundColor="$blue10" />
//                 </Avatar>
//               </Skeleton>
//               <View ml="$3">
//                 <Skeleton
//                   height={18}
//                   width={120}
//                   colorMode={skeletonColorScheme}
//                 >
//                   <SizableText
//                     size="$3"
//                     fontFamily="$mono"
//                     fontWeight={700}
//                   >
//                     {user.name}
//                   </SizableText>
//                 </Skeleton>
//                 {notiType ? (
//                   <Skeleton
//                     height={18}
//                     width={120}
//                     colorMode={skeletonColorScheme}
//                   >
//                     <SizableText
//                       size="$4"
//                       fontFamily="$mono"
//                       lineHeight={"$1"}
//                     >
//                       {notiBody(notiType)}
//                     </SizableText>
//                   </Skeleton>
//                 ) : (
//                   ""
//                 )}
//                 {notiType ? (
//                   <Skeleton
//                     height={18}
//                     width={120}
//                     colorMode={skeletonColorScheme}
//                   >
//                     <SizableText
//                       size="$4"
//                       fontFamily="$mono"
//                       col={"$gray10"}
//                       lineHeight={"$5"}
//                     >
//                       {notiDate ? `${formatSimpleDate(notiDate)}` : " "}
//                     </SizableText>
//                   </Skeleton>
//                 ) : (
//                   ""
//                 )}
//               </View>
//             </XStack>
//             <Skeleton
//               colorMode={skeletonColorScheme}
//               height={32}
//             >
//               {showButton ? (
//                 <Button
//                   disabled={isFollowingScreen || alreadyFollowing}
//                   themeInverse={!(isFollowingScreen || alreadyFollowing)}
//                   height="$2.5"
//                   width="$9"
//                   fontSize="$1"
//                   fontFamily="$mono"
//                   fontWeight={600}
//                   borderColor="$borderColor"
//                   pressStyle={{
//                     backgroundColor: "$gray7",
//                     borderColor: "$borderColorFocus",
//                   }}
//                   onPress={() => postFollow(user.id)}
//                 >
//                   {followingScreen || alreadyFollowing ? "Following" : "Follow"}
//                 </Button>
//               ) : null}
//             </Skeleton>
//           </XStack>
//         </Skeleton.Group>
//       );
//     },
//     [loading, screenType, skeletonColorScheme, isFollowing, postFollow]
//   );

//   return <ScrollView width="100%">{userList?.map(renderUser)}</ScrollView>;
// };

// export default UserScrollView;

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
