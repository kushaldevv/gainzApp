import { getUserProfile } from "@/services/apiCalls";
import { formatSessionDate, formatSessionTime, getPastSevenDays } from "@/services/utilities";
import * as Types from "@/types";
import { ArrowUpRight, Dumbbell, LogOut, UserCheck, UserPlus } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Avatar, Button, Circle, Spinner, Text, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import ContextMenuView from "./contextMenu";
import { useClerk, useUser } from "@clerk/clerk-expo";

const UserProfile = ({ userID, isPublicProfile, following }: Types.UserProfileProps) => {
  const colorMode = useColorScheme();
  const gradientColor = colorMode === "dark" ? "#006666" : "#33e6e6";
  const skeletonColorScheme = useColorScheme() == "dark" ? "light" : "dark" || "light";
  const [userProfile, setUserProfile] = useState<Types.UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userProfile?.id]);

  const fetchUserProfile = async () => {
    setLoading(true);
    if (userID) {
      try {
        const data = await getUserProfile(userID);
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
    setLoading(false);
  };

  const handleFollowingPress = () => {
    if (!userProfile) return;
    if (userProfile.following > 0) {
      router.push({
        pathname: isPublicProfile ? "/following" : "profile/following",
        params: {
          userID: userID,
          followingParam: JSON.stringify(userProfile.following),
        },
      });
    }
  };

  const handleFollowersPress = () => {
    if (!userProfile) return;
    if (userProfile.followers > 0) {
      router.push({
        pathname: isPublicProfile ? "/followers" : "profile/followers",
        params: {
          userID: userID,
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
      <Skeleton.Group show={loading}>
        <XStack
          alignItems="center"
          gap="$6"
          pt="$2"
          pb="$3"
        >
          <Skeleton
            colorMode={skeletonColorScheme}
            radius={"round"}
          >
            <View>
              <ContextMenuView label={"Update picture"}>
                <Circle
                  size="$8"
                  backgroundColor={"$background"}
                  borderWidth="$1"
                  borderColor={"#00cccc"}
                >
                  <Avatar
                    circular
                    size="$7"
                    pos={"absolute"}
                  >
                    <Avatar.Image src={userProfile?.pfp} />
                    <Avatar.Fallback backgroundColor="$blue10" />
                  </Avatar>
                </Circle>
              </ContextMenuView>
              {following != undefined && !loading && (
                <TouchableOpacity>
                  <Circle
                    size="$3"
                    backgroundColor={"$gray3"}
                    pos="absolute"
                    right="$-3"
                    bottom="$-1"
                  >
                    {following ? <UserCheck size="$1" /> : <UserPlus size="$1" />}
                  </Circle>
                </TouchableOpacity>
              )}
            </View>
          </Skeleton>

          <YStack gap="$4">
            <Skeleton colorMode={skeletonColorScheme}>
              <ContextMenuView label={"Update name"}>
                <Text
                  fontWeight="$11"
                  fontFamily={"$mono"}
                  fontSize="$8"
                  width={"$15"}
                  minHeight={"$2"}
                >
                  {userProfile?.name}
                </Text>
              </ContextMenuView>
            </Skeleton>
            <Skeleton colorMode={skeletonColorScheme}>
              <XStack
                gap="$4"
                alignItems="center"
              >
                <TouchableOpacity
                  onPress={() => handleFollowersPress()}
                  style={{ alignItems: "center" }}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="$5"
                  >
                    {userProfile?.followers}
                  </Text>
                  <Text
                    fontFamily={"$mono"}
                    fontSize="$4"
                  >
                    followers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFollowingPress()}
                  style={{ alignItems: "center" }}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="$5"
                  >
                    {userProfile?.following}
                  </Text>
                  <Text
                    fontFamily={"$mono"}
                    fontSize="$4"
                  >
                    following
                  </Text>
                </TouchableOpacity>
              </XStack>
            </Skeleton>
          </YStack>
        </XStack>

        <XStack justifyContent="space-between">
          <View width={"56.5%"}>
            <Skeleton
              colorMode={skeletonColorScheme}
              radius={26}
            >
              <View
                borderRadius="$9"
                backgroundColor={"$gray12"}
                opacity={colorMode == "dark" ? 1 : 0.925}
                alignItems="center"
                p="$3"
                height={"$13"}
              >
                <Text fontSize="$10">🔥</Text>
                <Text
                  fontFamily={"$mono"}
                  fontSize="$9"
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
                  {"Day Streak"}
                </Text>
              </View>
            </Skeleton>
          </View>
          <View width={"40%"}>
            <Skeleton
              colorMode={skeletonColorScheme}
              radius={26}
            >
              <LinearGradient
                borderRadius="$9"
                colors={["#00cccc", gradientColor]}
                start={[1, 0]}
                end={[0, 1]}
                alignItems="center"
                p="$3"
                gap="$2"
                height={"$13"}
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
            </Skeleton>
          </View>
        </XStack>
        <Skeleton
          colorMode={skeletonColorScheme}
          radius={26}
        >
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
            {userProfile?.highestDuration.date ? (
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
                  <Text
                    fontFamily={"$mono"}
                    fontSize={"$4"}
                  >
                    {formatSessionTime(userProfile?.highestDuration.duration!, true) || ""}
                  </Text>
                </View>
                <Text
                  fontFamily={"$mono"}
                  themeInverse
                  fontSize={"$4"}
                >
                  {formatSessionDate(userProfile?.highestDuration.date!)}
                </Text>
              </XStack>
            ) : (
              <Text></Text>
            )}
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
        </Skeleton>
        {/* {userID == user?.id && (
          <Skeleton
            colorMode={skeletonColorScheme}
            radius={14}
          >
            <Button
              backgroundColor={"$colorTransparent"}
              borderColor={"#00cccc"}
              borderWidth={1}
              fontFamily={"$mono"}
              fontWeight={600}
              fontSize={"$5"}
              color="#00cccc"
              borderRadius="$6"
              onPress={() => {
                signOut();
                setShowSpinner(true);
              }}
            >
              Log out
              {showSpinner && (
                <Spinner
                  size="small"
                  color={"#00cccc"}
                />
              )}
            </Button>
          </Skeleton>
        )} */}
      </Skeleton.Group>
    </YStack>
  );
};

export default UserProfile;
