import { appendSessionComment, appendSessionLikes, getSessionComments } from "@/services/apiCalls";
import {
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultFooterProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  Dumbbell,
  MessageCircleMore,
  MoreHorizontal,
  Send,
  ThumbsUp,
  X,
  Share,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";
import {
  Avatar,
  Circle,
  Paragraph,
  ScrollView,
  SizableText,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";
import * as Types from "@/types";
import CustomBackdrop from "./backdrop";
import Comment from "./comment";
import InnerCard from "./innerCard";
import { formatSessionDate, formatSessionTime } from "@/services/utilities";
import DropDownMenu from "./dropDownMenu";
import { useUser } from "@clerk/clerk-expo";

const emptyComment: Types.Comment = {
  user: {
    id: "",
    name: "",
    pfp: " ",
  },
  date: "",
  body: "",
  likes: [],
};

const Card = ({ session: initialSession, loading, userDetails: user }: Types.CardProps) => {
  // const userID = useUser().user?.id;
  const headerHeight = useHeaderHeight();
  const theme = useTheme();
  const router = useRouter();
  const skeletonColorScheme = useColorScheme() == "dark" ? "dark" : "light";
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [session, setSession] = useState(initialSession);
  const [hasLiked, setHasLiked] = useState(initialSession.userLiked);
  const sessionDuration = useMemo(() => formatSessionTime(session.duration), [session.duration]);
  const sessionDate = useMemo(() => formatSessionDate(session.date), [session.date]);
  const inputRef = useRef<any>(null);
  const commentTextRef = useRef("");
  const [comments, setComments] = useState<Types.Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    loadComments();
  }, [session.id]);

  const handleDismissModalPress = useCallback(() => {
    commentTextRef.current = "";
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleLikesScreen = () => {
    if (session.likes.length > 0) {
      router.push({
        pathname: "/likes",
        params: { sessionID: session.id, numLikes: session.numLikes },
      });
    }
  };

  const handleProfileScreen = () => {
    router.push({
      pathname: "/[user]",
      params: { userIdParam: session.user.id },
    });
  };

  const loadComments = async () => {
    setIsCommentsLoading(true);
    try {
      const data = await getSessionComments(session.user.id, session.id);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const postLike = async () => {
    if (!user) return;
    try {
      setHasLiked(true);
      setSession((prevSession) => {
        const newNumLikes = prevSession.numLikes + 1;
        return {
          ...prevSession,
          likes: newNumLikes <= 3 ? [...prevSession.likes, user] : prevSession.likes,
          numLikes: newNumLikes,
          userLiked: true,
        };
      });
      await appendSessionLikes(user.id, session.id);
    } catch (error) {
      throw error;
    }
  };

  const postComment = async () => {
    if (!user) return;
    try {
      setSession((prevSession) => ({
        ...prevSession,
        comments: prevSession.comments + 1,
      }));
      await appendSessionComment(user.id, session.id, commentTextRef.current);
    } catch (error) {
      throw error;
    } finally {
      loadComments();
    }
  };

  const renderFooter = useCallback(
    (props: React.JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps) => (
      <BottomSheetFooter {...props}>
        <View
          p="$4"
          pt="$4"
          pb="$6"
          backgroundColor={"$gray3"}
          borderTopWidth="$0.25"
          borderColor={"$gray5"}
        >
          <XStack gap="$2">
            <Avatar
              circular
              size="$4"
              alignSelf="center"
            >
              <Avatar.Image src={user?.pfp} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
            <BottomSheetTextInput
              placeholder="Add a comment..."
              onChangeText={(text) => {
                commentTextRef.current = text;
              }}
              ref={inputRef}
              defaultValue={commentTextRef.current}
              multiline={true}
              maxLength={256}
              style={{
                flex: 1,
                color: theme.color.val,
                borderColor: theme.gray10.val,
                borderWidth: 1,
                borderRadius: 20,
                paddingLeft: 18,
                paddingRight: 40,
                paddingTop: 12,
                paddingBottom: 12,
                textAlignVertical: "top",
              }}
            />
            <TouchableOpacity
              style={{
                alignSelf: "center",
                position: "absolute",
                right: 0,
                marginRight: 15,
              }}
              onPress={() => {
                if (commentTextRef.current.trim() !== "") {
                  postComment();
                  inputRef.current.clear();
                }
              }}
            >
              <Send size={"$1"} />
            </TouchableOpacity>
          </XStack>
        </View>
      </BottomSheetFooter>
    ),
    []
  );
  // const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT", "100%"], []);
  // const {
  //   animatedHandleHeight,
  //   animatedSnapPoints,
  //   animatedContentHeight,
  //   handleContentLayout,
  // } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <Skeleton.Group show={loading}>
      <YStack
        backgroundColor={"$gray1"}
        p="$3"
        gap="$2"
      >
        <XStack
          gap="$3"
          width="100%"
        >
          <Skeleton
            colorMode={skeletonColorScheme}
            radius={"round"}
          >
            <TouchableOpacity
              onPress={handleProfileScreen}
              disabled={session.user.id === user?.id}
            >
              <Avatar
                circular
                size="$5"
              >
                <Avatar.Image src={session.user.pfp} />
                <Avatar.Fallback backgroundColor="#00cccc" />
              </Avatar>
            </TouchableOpacity>
          </Skeleton>
          <YStack>
            <Skeleton
              colorMode={skeletonColorScheme}
              width={"50%"}
              height={15}
            >
              <SizableText
                size={"$2"}
                fontFamily={"$mono"}
                fontWeight={800}
                mb={"$1"}
              >
                {session.user.name || " "}
              </SizableText>
            </Skeleton>
            <Skeleton colorMode={skeletonColorScheme}>
              <XStack
                gap="$2"
                alignItems="center"
              >
                <Dumbbell size="$1" />
                <YStack>
                  <Paragraph
                    fontFamily={"$mono"}
                    lineHeight={"$1"}
                    fontSize={"$1"}
                  >
                    {sessionDate}
                  </Paragraph>
                  <Paragraph
                    fontFamily={"$mono"}
                    lineHeight={"$1"}
                    fontSize={"$1"}
                  >
                    {session.location}
                  </Paragraph>
                </YStack>
              </XStack>
            </Skeleton>
          </YStack>
          <View
            pos="absolute"
            right="$0"
          >
            <DropDownMenu isUser={initialSession.user.id == user?.id} />
          </View>
        </XStack>
        <Skeleton
          colorMode={skeletonColorScheme}
          width={"80%"}
        >
          <SizableText
            size={"$6"}
            fontFamily={"$mono"}
            fontWeight={700}
          >
            {session.name}
          </SizableText>
        </Skeleton>
        <Skeleton
          colorMode={skeletonColorScheme}
          width={"50%"}
        >
          <XStack gap="$5">
            <YStack>
              <Paragraph
                fontFamily={"$mono"}
                lineHeight={"$1"}
                fontSize={"$1"}
              >
                Exercises
              </Paragraph>
              <SizableText
                size={"$5"}
                fontFamily={"$mono"}
                fontWeight={700}
              >
                {session.exercises.length}
              </SizableText>
            </YStack>
            <YStack>
              <Paragraph
                fontFamily={"$mono"}
                lineHeight={"$1"}
                fontSize={"$1"}
              >
                Time
              </Paragraph>
              <SizableText
                size={"$4"}
                fontFamily={"$mono"}
                fontWeight={700}
              >
                {sessionDuration}
              </SizableText>
            </YStack>
          </XStack>
        </Skeleton>
        <Skeleton colorMode={skeletonColorScheme}>
          <InnerCard exercises={initialSession.exercises} />
        </Skeleton>
        <XStack
          justifyContent="space-between"
          paddingHorizontal="$10"
          paddingTop="$2"
        >
          <YStack
            alignItems="center"
            gap="$2"
            width={"$10"}
          >
            <Skeleton colorMode={skeletonColorScheme}>
              <TouchableOpacity
                onPress={handleLikesScreen}
                disabled={session.numLikes === 0}
              >
                <XStack>
                  {session.likes.map((item, index) => (
                    <Avatar
                      key={index}
                      circular
                      size="$1.5"
                      ml={index != 0 ? "$-2" : "$0"}
                      borderWidth="$0.25"
                      borderColor={"$color"}
                    >
                      <Avatar.Image src={item.pfp} />
                      <Avatar.Fallback backgroundColor="$blue10" />
                    </Avatar>
                  ))}
                  {session.numLikes > 3 && (
                    <Circle
                      size="$1.5"
                      backgroundColor="$gray7"
                      ml="$-2"
                      borderWidth="$0.25"
                      borderColor={"$color"}
                    >
                      <SizableText size={"$1"}>{session.numLikes - 3}+</SizableText>
                    </Circle>
                  )}
                  {session.numLikes == 0 && (
                    <View
                      height={"$1.5"}
                      justifyContent="center"
                    >
                      <SizableText
                        fontFamily={"$mono"}
                        size={"$1"}
                      >
                        Be the first to like!
                      </SizableText>
                    </View>
                  )}
                </XStack>
              </TouchableOpacity>
            </Skeleton>
            <View
              onPress={() => {
                if (!hasLiked) {
                  postLike();
                }
              }}
              height={"$2"}
            >
              {!loading && (
                <ThumbsUp
                  size={"$2"}
                  fill={hasLiked ? "#00cccc" : "none"}
                />
              )}
            </View>
          </YStack>
          <YStack
            alignItems="center"
            gap="$2"
            width={"$10"}
          >
            <Skeleton colorMode={skeletonColorScheme}>
              <View
                height={"$1.5"}
                justifyContent="center"
              >
                <SizableText
                  fontFamily={"$mono"}
                  size={"$1"}
                >
                  {session.comments} Comments
                </SizableText>
              </View>
            </Skeleton>
            {!loading && (
              <TouchableOpacity onPress={() => handlePresentModalPress()}>
                <MessageCircleMore size={"$2"} />
              </TouchableOpacity>
            )}
          </YStack>
        </XStack>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={["50%", "100%"]}
          // onChange={handleSheetChanges}
          backdropComponent={CustomBackdrop}
          handleIndicatorStyle={{ backgroundColor: theme.color.val }}
          backgroundStyle={{ backgroundColor: theme.gray3.val }}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          footerComponent={renderFooter}
          topInset={headerHeight}
        >
          <BottomSheetView>
            <YStack
              width={"100%"}
              height={"100%"}
              gap="$2"
            >
              <View
                p="$4"
                paddingVertical="$2"
              >
                <XStack justifyContent="center">
                  <SizableText
                    size={"$6"}
                    fontFamily={"$mono"}
                    fontWeight={700}
                  >
                    Comments
                  </SizableText>
                  <TouchableOpacity
                    style={{ position: "absolute", right: 0 }}
                    onPress={() => handleDismissModalPress()}
                  >
                    <X size="$2" />
                  </TouchableOpacity>
                </XStack>
              </View>
              <ScrollView
                borderTopWidth="$0.25"
                borderColor={"$gray5"}
              >
                <View
                  gap="$5"
                  mt="$3"
                  p="$4"
                  pt="$2"
                >
                  {isCommentsLoading
                    ? Array.from({ length: session.comments }).map((_, index) => (
                        <Comment
                          key={index}
                          index={index}
                          comment={emptyComment}
                          sessionID=""
                          userID={""}
                          loading={true}
                        />
                      ))
                    : comments.map((comment, index) => (
                        <Comment
                          key={index}
                          index={index}
                          comment={comment}
                          sessionID={session.id}
                          userID={user?.id!}
                          loading={false}
                          handleDismissModalPress={handleDismissModalPress}
                        />
                      ))}
                </View>
              </ScrollView>
            </YStack>
          </BottomSheetView>
        </BottomSheetModal>
      </YStack>
    </Skeleton.Group>
  );
};

export default Card;
