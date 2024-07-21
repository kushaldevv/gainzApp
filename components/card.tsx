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
} from "@tamagui/lucide-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import * as Types from "../types";
import CustomBackdrop from "./backdrop";
import Comment from "./comment";
import { useUser } from "@clerk/clerk-expo";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";
import { getSessionComments } from "@/services/apiCalls";

const emptyComment: Types.Comment = {
  id: "",
  user: {
    id: "",
    name: "",
    pfp: " ",
  },
  date: "",
  body: "",
  likes: 0,
};

const Card = ({ session, loading }: Types.CardProps) => {
  const { user } = useUser();
  const theme = useTheme();
  const skeletonColorScheme =
    useColorScheme() == "dark" ? "light" : "dark" || "light";
  const [like, setLike] = useState(false);
  const headerHeight = useHeaderHeight();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Types.Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    loadComments();
    bottomSheetModalRef.current?.present();
  }, [session.id]);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

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
            <Avatar circular size="$4" alignSelf="center">
              <Avatar.Image src={user?.imageUrl} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
            <BottomSheetTextInput
              placeholder="Add a comment..."
              onChangeText={(text) => setComment(text)}
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
            <Send
              size={"$1"}
              alignSelf="center"
              right="$0"
              pos={"absolute"}
              mr="$3"
            />
          </XStack>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <Skeleton.Group show={loading}>
      <YStack backgroundColor={"$gray1"} p="$3" gap="$2">
        <XStack gap="$3" width="100%">
          <Skeleton colorMode={skeletonColorScheme} radius={"round"}>
            <Avatar circular size="$5">
              <Avatar.Image src={session.user.pfp} />
              <Avatar.Fallback backgroundColor="#00cccc" />
            </Avatar>
          </Skeleton>
          <YStack>
            <Skeleton colorMode={skeletonColorScheme} width={"50%"} height={15}>
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
              <XStack gap="$2" alignItems="center">
                <Dumbbell size="$1" />
                <YStack>
                  <Paragraph lineHeight={"$1"} fontSize={"$1"}>
                    {formatSessionDate(session.date)}
                  </Paragraph>
                  <Paragraph lineHeight={"$1"} fontSize={"$1"}>
                    {session.location}
                  </Paragraph>
                </YStack>
              </XStack>
            </Skeleton>
          </YStack>
          <View pos="absolute" right="$0">
            {!loading && <MoreHorizontal />}
          </View>
        </XStack>
        <Skeleton colorMode={skeletonColorScheme} width={"90%"}>
          <SizableText size={"$6"} fontFamily={"$mono"} fontWeight={700}>
            {session.name}
          </SizableText>
        </Skeleton>
        <Skeleton colorMode={skeletonColorScheme} width={"50%"}>
          <XStack gap="$5">
            <YStack>
              <Paragraph lineHeight={"$1"} fontSize={"$1"}>
                Exercises
              </Paragraph>
              <SizableText size={"$5"} fontFamily={"$mono"} fontWeight={700}>
                {session.exercises.length}
              </SizableText>
            </YStack>
            <YStack>
              <Paragraph lineHeight={"$1"} fontSize={"$1"}>
                Time
              </Paragraph>
              <SizableText size={"$4"} fontFamily={"$mono"} fontWeight={700}>
                {formatSessionTime(session.duration)}
              </SizableText>
            </YStack>
          </XStack>
        </Skeleton>
        <Skeleton colorMode={skeletonColorScheme}>
          <View
            height={"$15"}
            alignItems="center"
            justifyContent="center"
            backgroundColor={"#00cccc"}
            borderRadius={"$5"}
          >
            <SizableText>Card Action</SizableText>
          </View>
        </Skeleton>
        <XStack
          justifyContent="space-between"
          paddingHorizontal="$10"
          paddingTop="$2"
        >
          <YStack alignItems="center" gap="$2" width={"$10"}>
            <Skeleton colorMode={skeletonColorScheme}>
              <XStack>
                {session.likes.slice(0, 3).map((item, index) => (
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
                {session.likes.length > 3 && (
                  <Circle
                    size="$1.5"
                    backgroundColor="$gray7"
                    ml="$-2"
                    borderWidth="$0.25"
                    borderColor={"$color"}
                  >
                    <SizableText size={"$1"}>
                      {session.likes.length - 3}+
                    </SizableText>
                  </Circle>
                )}
                {session.likes.length == 0 && (
                  <View height={"$1.5"} justifyContent="center">
                    <SizableText size={"$1"}>Be the first to like!</SizableText>
                  </View>
                )}
              </XStack>
            </Skeleton>
            <View onPress={() => setLike(!like)} height={"$2"}>
              {!loading && (
                <ThumbsUp size={"$2"} fill={like ? "#00cccc" : "none"} />
              )}
            </View>
          </YStack>
          <YStack alignItems="center" gap="$2" width={"$10"}>
            <Skeleton colorMode={skeletonColorScheme}>
              <View height={"$1.5"} justifyContent="center">
                <SizableText size={"$1"}>
                  {session.comments} Comments
                </SizableText>
              </View>
            </Skeleton>
            {!loading && (
              <View onPress={() => handlePresentModalPress()}>
                <MessageCircleMore size={"$2"} />
              </View>
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
            <YStack width={"100%"} gap="$2">
              <View p="$4" paddingVertical="$2">
                <XStack justifyContent="center">
                  <SizableText
                    size={"$6"}
                    fontFamily={"$mono"}
                    fontWeight={700}
                  >
                    Comments
                  </SizableText>
                  <View
                    pos="absolute"
                    right="$0"
                    onPress={() => handleDismissModalPress()}
                  >
                    <X size="$2" />
                  </View>
                </XStack>
              </View>
              <ScrollView borderTopWidth="$0.25" borderColor={"$gray5"}>
                <View gap="$5" mt="$3" p="$4" pt="$2">
                  {isCommentsLoading
                    ? Array.from({ length: session.comments }).map(
                        (_, index) => (
                          <Comment
                            key={index}
                            comment={emptyComment}
                            loading={true}
                          />
                        )
                      )
                    : comments.map((comment, index) => (
                        <Comment
                          key={index}
                          comment={comment}
                          loading={false}
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

function formatSessionDate(isoString: string) {
  const sessionDate = new Date(isoString);
  const now = new Date();
  const isToday = now.toDateString() === sessionDate.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    sessionDate.toDateString();

  const timeString = sessionDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today at ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday at ${timeString}`;
  } else {
    return (
      sessionDate.toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + ` at ${timeString}`
    );
  }
}

function formatSessionTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = "";
  if (hours > 0) result += `${hours}hr `;
  if (minutes > 0) result += `${minutes}m `;
  result += `${remainingSeconds}s`;

  return result.trim();
}
