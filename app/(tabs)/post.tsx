import { appendSession } from "@/services/apiCalls";
import React, { useState } from "react";
import { YStack, Button, Input, XStack, Group, YGroup, Separator, ListItem } from "tamagui";
import * as Types from "@/types";
import { useUser } from "@clerk/clerk-expo";
import DateTimePicker from '@react-native-community/datetimepicker';


const Post = () => {
  const [sessionName, setSessionName] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(0);

  const [exerciseName, setExerciseName] = useState("");
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const {user} = useUser();
  
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');

  const onChange = () => {

  };

  // const showMode = (modeToShow) => {

  // };

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
      gap={"$4"}
      pt={"$4"}
    >
      <YStack width="90%">
        <YGroup separator={<Separator />}>
          <YGroup.Item>
            {/* <ListItem title="Name" /> */}
            <Input placeholder="Name"></Input>
          </YGroup.Item>
          <YGroup.Item>
            {/* <ListItem title="Second" subTitle="Second subtitle" /> */}
            <Input>Start Time</Input>
            <DateTimePicker title={'Select time'} placeholder={'Placeholder'} mode={'time'}/>
          </YGroup.Item>
          <YGroup.Item>
            {/* <ListItem>Third</ListItem> */}
            <Input>End Time</Input>
          </YGroup.Item>
        </YGroup>
      </YStack>
    </YStack>
  );
};

export default Post;
