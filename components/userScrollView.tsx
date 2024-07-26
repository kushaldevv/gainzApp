// import React, { useCallback, useState } from "react";
// import { Avatar, ScrollView, SizableText, XStack, Button, View } from "tamagui";
// import * as Types from "@/types";
// import { Skeleton } from "moti/skeleton";
// import { useColorScheme } from "react-native";
// import { useFocusEffect } from "expo-router";
// import {appendFollowing} from "@/services/apiCalls";
// import { useUser } from "@clerk/clerk-expo";

// enum ScreenType {
//   FOLLOWING,
//   FOLLOWERS,
// }

// const UserScrollView = ({ followers, following, loading }: Types.UserScrollViewProps) => {
//   const skeletonColorScheme = useColorScheme() == "dark" ? "light" : "dark" || "light";
//   const screenType: ScreenType = followers ? ScreenType.FOLLOWERS : ScreenType.FOLLOWING;
//   const userList = screenType === ScreenType.FOLLOWERS ? followers : following;
//   const {user} = useUser();

//   const postFollow = async (followingID: string) => {
//     try {
//       console.log(following.some(user => user.id === followingID));
//       await appendFollowing(user?.id!, followingID);
//     } catch (error) {
//       console.error("Error following user:", error);
//     }
//   }

//   return (
//     <ScrollView width={"100%"}>
//       {(userList!).map((user: Types.User, index: number) => {
//         const [alreadyFollowing, setAlreadyFollowing] = useState(following.some(i => i.id == user.id));
//         const followingScreen = screenType === ScreenType.FOLLOWING;
//         return(
//         <Skeleton.Group
//           show={loading}
//           key={index}
//         >
//           <XStack
//             padding="$3"
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
//                   size="$4.5"
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
//                     size={"$4"}
//                     fontFamily={"$mono"}
//                     fontWeight={700}
//                   >
//                     {user.name}
//                   </SizableText>
//                 </Skeleton>
//               </View>
//             </XStack>
//             <Skeleton
//               colorMode={skeletonColorScheme}
//               height={32}
//             >
//               <Button
//                 disabled={followingScreen ? true : alreadyFollowing ? true :false}
//                 themeInverse = {followingScreen ? false : alreadyFollowing ? false :true}
//                 height={"$2.5"}
//                 width={"$9"}
//                 fontSize={"$1"}
//                 fontFamily={"$mono"}
//                 fontWeight={600}
//                 borderColor={'$borderColor'}
//                 pressStyle={{
//                   backgroundColor: "$gray7",
//                   borderColor: "$borderColorFocus",
//                 }}
//                 onPress={() => {
//                   postFollow(user?.id)
//                   setAlreadyFollowing(true)
//                 }}
//               >
//                 {followingScreen ? "Following" : alreadyFollowing ? "Following" : "Follow"}
//               </Button>
//             </Skeleton>
//           </XStack>
//         </Skeleton.Group>
//       )})}
//     </ScrollView>
//   );
// };

// export default UserScrollView;
import React, { useCallback, useMemo, useState } from "react";
import { Avatar, ScrollView, SizableText, XStack, Button, View } from "tamagui";
import * as Types from "@/types";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";
import { appendFollowing } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";

enum ScreenType {
  FOLLOWING,
  FOLLOWERS,
  NOTIS,
}

const UserScrollView = ({ followers, following, loading }: Types.UserScrollViewProps) => {
  const skeletonColorScheme = useColorScheme() === "dark" ? "light" : "dark";
  const screenType: ScreenType = followers ? ScreenType.FOLLOWERS : ScreenType.FOLLOWING;
  const userList = screenType === ScreenType.FOLLOWERS ? followers : following;
  const { user } = useUser();
  const [followingState, setFollowingState] = useState<Set<string>>(
    new Set(following?.map((f) => f.id))
  );

  const isFollowing = useCallback((userId: string) => followingState.has(userId), [followingState]);

  const postFollow = async (followingID: string) => {
    try {
      await appendFollowing(user?.id!, followingID);
      setFollowingState((prev) => new Set(prev).add(followingID));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const renderUser = useCallback(
    (user: Types.User, index: number) => {
      const alreadyFollowing = isFollowing(user.id);
      const followingScreen = screenType === ScreenType.FOLLOWING;

      return (
        <Skeleton.Group
          show={loading}
          key={user.id || index}
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
                    size="$4"
                    fontFamily="$mono"
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
                disabled={followingScreen || alreadyFollowing}
                themeInverse={!followingScreen && !alreadyFollowing}
                height="$2.5"
                width="$9"
                fontSize="$1"
                fontFamily="$mono"
                fontWeight={600}
                borderColor="$borderColor"
                pressStyle={{
                  backgroundColor: "$gray7",
                  borderColor: "$borderColorFocus",
                }}
                onPress={() => postFollow(user.id)}
              >
                {followingScreen || alreadyFollowing ? "Following" : "Follow"}
              </Button>
            </Skeleton>
          </XStack>
        </Skeleton.Group>
      );
    },
    [loading, screenType, skeletonColorScheme, isFollowing, postFollow]
  );

  return <ScrollView width="100%">{userList?.map(renderUser)}</ScrollView>;
};

export default UserScrollView;
