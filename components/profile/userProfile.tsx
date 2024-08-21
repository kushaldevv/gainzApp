import {
  getPieChartData,
  getUserFollowingList,
  getUserProfile,
  updateName,
} from "@/services/apiCalls";
import { formatSessionDate, formatSessionTime, getPastSevenDays } from "@/services/utilities";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { ArrowUpRight, CheckSquare, Dumbbell, UserCheck, UserPlus } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Avatar, Circle, Input, Text, useTheme, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import ContextMenuView from "./contextMenu";
import DropDownMenu from "./dropDownMenu";
import { PieChart } from "react-native-gifted-charts";

const pieData = [
  {
    value: 47,
    color: "#009FFF",
    gradientCenterColor: "#006DFF",
    focused: true,
  },
  { value: 40, color: "#93FCF8", gradientCenterColor: "#3BE9DE" },
  { value: 16, color: "#BDB2FA", gradientCenterColor: "#8F80F3" },
  { value: 3, color: "#FFA5BA", gradientCenterColor: "#FF7F97" },
];
const UserProfile = ({ userID, isPublicProfile }: Types.UserProfileProps) => {
  const colorMode = useColorScheme();
  const gradientColor = colorMode === "dark" ? "#006666" : "#4d9999";
  const skeletonColorScheme = useColorScheme() == "dark" ? "dark" : "light";
  const [userProfile, setUserProfile] = useState<Types.UserProfile | null>(null);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [userProfileName, setUserProfileName] = useState("");
  const [pieChartData, setPieChartData] = useState<Types.PieChartData[]>([]);
  useEffect(() => {
    fetchUserProfile();
  }, [userProfile?.id]);

  const fetchUserProfile = async () => {
    setLoading(true);
    if (userID) {
      try {
        const userProfileData = await getUserProfile(userID);
        const pieData = await getPieChartData(userID, theme);
        if (user) {
          if (user.id != userID) {
            const followingListData = await getUserFollowingList(user.id);
            setFollowing(followingListData.includes(userID));
          }
        }
        setPieChartData(pieData);
        setUserProfile(userProfileData);
        setEditedName(userProfileData.name);
        setUserProfileName(userProfileData.name);
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

  const handleSessionsPresss = () => {
    if (!userProfile) return;

    if (userProfile.randomPr) {
      router.push({
        pathname: isPublicProfile ? "/sessions" : "profile/sessions",
        params: {
          userID: userID,
        },
      });
    }
  };

  const postNewName = async (newName: string) => {
    try {
      if (!(newName === userProfileName)) {
        console.log("newName: ", newName);
        console.log("API call");
        await updateName(user?.id!, newName);
        setUserProfileName(newName);
      }
    } catch (error) {
      console.error("Error changing the user's name: ", error);
    } finally {
      setIsEditing(false);
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
          <View>
            <ContextMenuView label={"Update picture"}>
              <Skeleton
                radius={"round"}
                colorMode={skeletonColorScheme}
              >
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
              </Skeleton>
            </ContextMenuView>

            {following != null && !loading && (
              <TouchableOpacity style={{ position: "absolute", right: -13, bottom: -2 }}>
                <DropDownMenu
                  setFollowing={setFollowing}
                  action={following ? "Unfollow" : "Follow"}
                  userId1={user?.id!}
                  userId2={userID}
                >
                  <Circle
                    size="$3"
                    backgroundColor={"$gray3"}
                  >
                    {following ? <UserCheck size="$1" /> : <UserPlus size="$1" />}
                  </Circle>
                </DropDownMenu>
              </TouchableOpacity>
            )}
          </View>
          <YStack gap="$4">
            <Skeleton colorMode={skeletonColorScheme}>
              <XStack
                ml="$-3.5"
                mb="$-2.5"
                alignItems="center"
              >
                <ContextMenuView
                  label={"Update name"}
                  setIsEditing={setIsEditing}
                >
                  <Input
                    fontWeight="$11"
                    fontFamily={"$mono"}
                    fontSize="$8"
                    width={"$16"}
                    minHeight={"$2"}
                    backgroundColor={"$colorTransparent"}
                    borderRadius={"$6"}
                    borderColor={isEditing ? "$borderColorFocus" : "$colorTransparent"}
                    disabled={!isEditing}
                    onChangeText={(text) => setEditedName(text)}
                  >
                    {userProfile?.name}
                  </Input>
                </ContextMenuView>
                {isEditing && (
                  <TouchableOpacity onPress={() => postNewName(editedName)}>
                    <CheckSquare
                      size={"$1"}
                      ml="$3"
                      col={"$green10"}
                    />
                  </TouchableOpacity>
                )}
              </XStack>
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
          <View width={"52%"}>
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
                pt="$2"
                height={"$15"}
                justifyContent="flex-start"
                gap="$1.5"
              >
                {pieChartData.length > 0 && (
                  <PieChart
                    data={pieChartData}
                    // donut
                    showGradient
                    sectionAutoFocus
                    radius={68}
                    innerRadius={45}
                    innerCircleColor={"#232B5D"}
                    // centerLabelComponent={() => {
                    //   return (
                    //     <View style={{ justifyContent: "center", alignItems: "center" }}>

                    //       {/* <Text textAlign="center" style={{ fontSize: 14, color: "white" }}>Muscle Group</Text> */}
                    //     </View>
                    //   );
                    // }}
                  />
                )}
                <XStack
                  alignSelf="center"
                  gap="$1"
                >
                  {[
                    { name: "Arms", color: "$blue10" },
                    { name: "Back", color: "$green10" },
                    { name: "Chest", color: "$orange10" },
                  ].map((item: { name: string; color: string }) => (
                    <XStack
                      key={item.name}
                      gap="$1.5"
                      alignItems="center"
                    >
                      <Circle
                        size={10}
                        backgroundColor={item.color}
                      />
                      <Text
                        themeInverse
                        fontFamily={"$mono"}
                        fontSize={12}
                        fontWeight="400"
                        w="$3"
                      >
                        {item.name}
                      </Text>
                    </XStack>
                  ))}
                </XStack>
                <XStack
                  alignSelf="center"
                  gap="$1"
                >
                  {[
                    { name: "Legs", color: "$red10" },
                    { name: "Abs", color: "$purple10" },
                    { name: "Other", color: "$gray10" },
                  ].map((item: { name: string; color: string }) => (
                    <XStack
                      key={item.name}
                      gap="$1.5"
                      alignItems="center"
                    >
                      <Circle
                        size={10}
                        backgroundColor={item.color}
                      />
                      <Text
                        themeInverse
                        fontFamily={"$mono"}
                        fontSize={12}
                        fontWeight="400"
                        w="$3"
                      >
                        {item.name}
                      </Text>
                    </XStack>
                  ))}
                </XStack>
              </View>
            </Skeleton>
          </View>
          <View width={"44.5%"}>
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
                height={"$15"}
              >
                <Text fontSize="$12">🔥</Text>
                <Text
                  fontFamily={"$mono"}
                  fontSize="$11"
                  fontWeight="900"
                  col="white"
                  mt="$-1"
                >
                  {userProfile?.streak}
                </Text>
                <Text
                  fontFamily={"$mono"}
                  fontSize="$8"
                  fontWeight="600"
                  col="white"
                >
                  {"Day Streak"}
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
              <TouchableOpacity onPress={() => handleSessionsPresss()}>
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
              {userID == user?.id ? "Your" : "Their"} Activity
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
              {getPastSevenDays().map((day, index) => {
                const highestDuration = userProfile?.highestDuration.duration;
                const currDayDuration = userProfile?.recentSessions[day][0]?.duration;
                return (
                  <YStack
                    key={index}
                    gap="$2"
                    width={38}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {currDayDuration && (
                      <LinearGradient
                        width={"100%"}
                        height={(currDayDuration / highestDuration!) * 150}
                        borderRadius="$5"
                        colors={
                          highestDuration == currDayDuration
                            ? ["$background", "$background"]
                            : ["#00cccc", gradientColor]
                        }
                        start={[1, 0]}
                        end={[0, 1]}
                      ></LinearGradient>
                    )}
                    <Text
                      fontSize={"$2"}
                      fontFamily={"$mono"}
                      themeInverse
                      fontWeight="500"
                    >
                      {day}
                    </Text>
                  </YStack>
                );
              })}
            </XStack>
          </YStack>
        </Skeleton>
      </Skeleton.Group>
    </YStack>
  );
};

export default UserProfile;
