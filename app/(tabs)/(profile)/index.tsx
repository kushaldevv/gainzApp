import { getUserProfile } from "@/services/apiCalls";
import * as Types from "@/types";
import { useClerk, useUser } from "@clerk/clerk-expo";
import MaskedView from "@react-native-masked-view/masked-view";
import { X, ArrowUpRight, Dumbbell } from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Avatar, Button, Circle, Text, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { formatSessionDate, formatSessionTime, getPastSevenDays } from "@/services/utilities";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const colorMode = useColorScheme();
  const gradientColor = colorMode === "dark" ? "#006666" : "#33e6e6";
  const [userProfile, setUserProfile] = useState<Types.UserProfile | null>(null);
  const [followingList, setFollowingList] = useState<string[]>([]);
  // const [userExerciseInfo, setUserExerciseInfo] = useState<Types.UserExercise | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const data = await getUserProfile(user.id);
        setUserProfile(data);
        const newFollowingList = userProfile?.following.map((user) => user.id);
        setFollowingList(newFollowingList!);
        router.setParams({
          followersParam: JSON.stringify(userProfile?.followers),
          followingParam: JSON.stringify(userProfile?.following),
          followingListParam: JSON.stringify(newFollowingList),
        });
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  const handleFollowingPress = () => {
    if (!userProfile) return;
    if (userProfile.following.length > 0) {
      router.push({
        pathname: "/following",
        params: {
          followingParam: JSON.stringify(userProfile.following),
          followingListParam: JSON.stringify(followingList),
        },
      });
    }
  };

  const handleFollowersPress = () => {
    if (!userProfile) return;
    if (userProfile.followers.length > 0) {
      router.push({
        pathname: "/followers",
        params: {
          followingListParam: JSON.stringify(followingList),
          followersParam: JSON.stringify(userProfile.followers),
        },
      });
    }
  };

  return (
    <YStack
      flex={1}
      p="$3"
      backgroundColor="$background"
      gap="$3"
    >
      <XStack
        alignItems="center"
        gap="$6"
        pt="$2"
        pb="$3"
      >
        <Circle
          size="$9"
          backgroundColor={"$background"}
          borderWidth="$1"
          borderColor={"#00cccc"}
        >
          <Avatar
            circular
            size="$8"
            pos={"absolute"}
          >
            <Avatar.Image src={userProfile?.pfp} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
        </Circle>
        <YStack gap="$4">
          <Text
            fontWeight="$11"
            fontFamily={"$mono"}
            fontSize="$8"
            width={"$15"}
          >
            {"Kushal Devkota"}
          </Text>
          <XStack gap="$6">
            <TouchableOpacity
              onPress={() => handleFollowersPress()}
              style={{ alignItems: "center" }}
            >
              <Text
                fontWeight="bold"
                fontSize="$5"
              >
                {userProfile?.followers.length!}
              </Text>
              <Text fontSize="$4">followers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFollowingPress()}
              style={{ alignItems: "center" }}
            >
              <Text
                fontWeight="bold"
                fontSize="$5"
              >
                {userProfile?.following.length!}
              </Text>
              <Text fontSize="$4">following</Text>
            </TouchableOpacity>
          </XStack>
        </YStack>
      </XStack>

      <XStack
        height={"$13"}
        justifyContent="space-between"
      >
        <View
          width={"56.5%"}
          borderRadius="$9"
          backgroundColor={"$gray12"}
          opacity={colorMode == "dark" ? 1 : 0.925}
          alignItems="center"
          p="$3"
        >
          <Text fontSize="$10">💪</Text>
          <Text
            fontFamily={"$mono"}
            fontSize="$10"
            fontWeight="900"
            col="$background"
          >
            {userProfile?.streak}
          </Text>
          <Text
            fontFamily={"$mono"}
            fontSize="$8"
            fontWeight="400"
            col="$background"
          >
            {'Day Streak'}
          </Text>
        </View>
        <LinearGradient
            width={"40%"}
            borderRadius="$9"
            colors={["#00cccc", gradientColor]}
            start={[1, 0]}
            end={[0, 1]}
            alignItems="center"
            p="$3"
            gap="$2"
          >
            <Circle
              backgroundColor={"white"}
              size="$4.5"
              mb="$1.5"
            >
              <Dumbbell
                size="$1.5"
                col={"black"}
              />
            </Circle>
            <XStack
              alignItems="center"
              gap="$1.5"
            >
              <Text
                fontFamily={"$mono"}
                fontSize="$9"
                fontWeight="700"
                col="$color"
              >
                {userProfile?.randomPr.pr}
              </Text>
              <Text
                fontFamily={"$mono"}
                fontSize="$6"
                fontWeight="500"
                col="$color"
                mt="$2"
              >
                lbs
              </Text>
            </XStack>
            <Text
              fontFamily={"$mono"}
              fontSize="$4"
              fontWeight="400"
              col="$color"
              textAlign="center"
            >
              {userProfile?.randomPr.name}
            </Text>
          </LinearGradient>
      </XStack>
      <YStack
        borderRadius="$9"
        backgroundColor={"$gray12"}
        opacity={colorMode == "dark" ? 1 : 0.925}
        height={"$20"}
        p="$4"
      >
        <Circle
          pos={"absolute"}
          right={"$-2.5"}
          top={"$-2.5"}
          backgroundColor={"$background"}
          size={"$7"}
          zIndex={1}
        >
          <TouchableOpacity>
            <LinearGradient
              width={"$5"}
              height={"$5"}
              alignItems="center"
              justifyContent="center"
              borderRadius="$10"
              colors={["#00cccc", gradientColor]}
              start={[1, 0]}
              end={[0, 1]}
            >
              <ArrowUpRight
                size={"$2"}
                color={"white"}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Circle>
        <Text
          themeInverse
          fontFamily={"$mono"}
          fontSize={"$9"}
          fontWeight="600"
        >
          Your activity
        </Text>
        <XStack
          pt="$2.5"
          alignItems="center"
          gap="$3"
        >
          <View
            backgroundColor={"$background"}
            borderRadius={"$6"}
            p="$2"
          >
            <Text fontSize={"$4"}>
              {formatSessionTime(userProfile?.highestDuration.duration!, true)}
            </Text>
          </View>
          <Text
            themeInverse
            fontSize={"$4"}
          >
            {formatSessionDate(userProfile?.highestDuration.date!)}
          </Text>
        </XStack>
        <XStack
          gap="$3"
          pos={"absolute"}
          bottom="$3"
          alignSelf="center"
        >
          {getPastSevenDays().map((day, index) => (
            <YStack
              key={index}
              gap="$2"
              alignItems="center"
              justifyContent="flex-end"
            >
              <LinearGradient
                width={38}
                height={
                  userProfile?.recentSessions[day][0]?.duration
                    ? userProfile?.recentSessions[day][0]?.duration / 60
                    : 0
                }
                borderRadius="$5"
                colors={
                  userProfile?.highestDuration.duration ==
                  userProfile?.recentSessions[day][0]?.duration
                    ? ["$background", "$background"]
                    : ["#00cccc", gradientColor]
                }
                start={[1, 0]}
                end={[0, 1]}
              ></LinearGradient>
              <Text
                fontSize={"$2"}
                fontFamily={"$mono"}
                themeInverse
                fontWeight="500"
              >
                {day}
              </Text>
            </YStack>
          ))}
        </XStack>
      </YStack>
      {/* <Button onPress={() => signOut()}>Log out</Button>  */}
    </YStack>
  );
};

export default Profile;
