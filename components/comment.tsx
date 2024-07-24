import { Heart } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Paragraph,
  SizableText,
  View,
  XStack,
  YStack,
} from "tamagui";
import * as Types from "../types";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";
import { appendLikeToComment } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";
import { useFocusEffect } from "expo-router";

const Comment = ({
  index,
  comment,
  sessionID,
  userID,
  loading,
}: Types.CommentProps) => {
  const [like, setLike] = useState(false);

  useFocusEffect(() => {
    if (comment.likes) {
      const userLiked = comment.likes.some((likeUser) => likeUser == userID);
      if (userLiked) {
        setLike(true);
      }
    }
  });

  const postLike = async () => {
    console.log("previously liked ", like);
    if (!like) {
      try {
        await appendLikeToComment(userID as string, sessionID, index);
        comment.likes.push(userID as string);
        console.log("Liked comment");
      } catch (error) {
        console.error("Error liking comment:", error);
      }
      setLike(true);
    }
  };

  const skeletonColorScheme =
    useColorScheme() == "dark" ? "light" : "dark" || "light";
  return (
    <Skeleton.Group show={loading}>
      <XStack gap="$2">
        <Skeleton radius={"round"} colorMode={skeletonColorScheme}>
          <Avatar circular size="$3">
            <Avatar.Image src={comment.user.pfp} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>
        </Skeleton>
        <YStack width={"$20"} gap={"$0.5"}>
          <Skeleton colorMode={skeletonColorScheme} width={"50%"} height={15}>
            <XStack gap="$1">
              <SizableText size={"$1"} fontFamily={"$mono"} fontWeight={800}>
                {comment.user.name}
              </SizableText>
              <SizableText
                size={"$1"}
                color={"$gray11"}
                fontFamily={"$mono"}
                fontWeight={400}
              >
                {formatSimpleDate(comment.date)}
              </SizableText>
            </XStack>
          </Skeleton>
          <Skeleton colorMode={skeletonColorScheme} width={"80%"}>
            <Paragraph lineHeight={"$1"} fontSize={"$2"} textAlign="left">
              {comment.body}
            </Paragraph>
          </Skeleton>
        </YStack>
        {!loading && (
          <YStack position="absolute" right="$1" alignItems="center">
            <Heart
              size={"$1"}
              fill={like ? "#e5484d" : "none"}
              onPress={() => postLike()}
            />
            <SizableText size={"$1"} color={"$gray11"}>
              {comment.likes.length}
            </SizableText>
          </YStack>
        )}
      </XStack>
    </Skeleton.Group>
  );
};

export default Comment;

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
