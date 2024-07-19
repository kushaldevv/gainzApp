import { Heart } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Avatar, Paragraph, SizableText, XStack, YStack } from "tamagui";
import * as Types from "../types";

const Comment = ({ comment }: Types.CommentProps) => {
  
  const [like, setLike] = useState(false);
  return (
    <XStack gap="$2">
      <Avatar circular size="$3">
        <Avatar.Image src={comment.user.pfp} />
        <Avatar.Fallback backgroundColor="$blue10" />
      </Avatar>
      <YStack width={"$20"}>
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
        <Paragraph lineHeight={"$1"} fontSize={"$2"} textAlign="left">
          {comment.body}
        </Paragraph>
      </YStack>
      <YStack position="absolute" right="$1" alignItems="center">
        <Heart
          size={"$1"}
          fill={like ? "red" : "none"}
          onPress={() => setLike(!like)}
        />
        <SizableText size={"$1"} color={"$gray11"}>
          {comment.likes}
        </SizableText>
      </YStack>
    </XStack>
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
