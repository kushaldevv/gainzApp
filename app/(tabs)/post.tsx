import { appendSession } from "@/services/apiCalls";
import React, { useState } from "react";
import { YStack, Button, Input, XStack, Group, YGroup, Separator, ListItem } from "tamagui";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
// import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'

const Post = () => {
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
      gap={"$4"}
      pt={"$4"}
    >
      <Button onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </YStack>
  );
};

export default Post;
