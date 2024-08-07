import { daysFull, formatSessionDate } from "@/services/utilities";
import * as Types from "@/types";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import DatePicker from "react-native-date-picker";
import {
  Input,
  ListItem,
  ScrollView,
  Separator,
  Text,
  XStack,
  YGroup,
  YStack
} from "tamagui";
import { ExercisesContext } from "./_layout";
import ExerciseAccordion from "@/components/post/accordionItem";

const ManualPost = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const { exercises, setExercises } = useContext(ExercisesContext);

  return (
    <ScrollView backgroundColor={"$background"}>
      <YStack
        flex={1}
        alignItems="center"
        gap={"$4"}
        padding={"$3"}
      >
        <YGroup separator={<Separator />}>
          <YGroup.Item>
            <Input
              borderWidth="$0"
              fontFamily={"$mono"}
              placeholder={daysFull[new Date().getDay()] + "'s workout"}
            ></Input>
          </YGroup.Item>
          <YGroup.Item>
            {/* <ListItem title="Start Time"/> */}
            <XStack
              alignItems="center"
              justifyContent="space-between"
            >
              <ListItem>
                <Text fontFamily={"$mono"}>Start Time</Text>
                <TouchableOpacity onPress={() => setStartOpen(true)}>
                  <Text
                    fontFamily={"$mono"}
                    color={"#00cccc"}
                  >
                    {formatSessionDate(startDate.toISOString())}
                  </Text>
                </TouchableOpacity>
              </ListItem>
            </XStack>
          </YGroup.Item>
          <YGroup.Item>
            {/* <ListItem title="End Time"/> */}
            <XStack
              alignItems="center"
              justifyContent="space-between"
            >
              <ListItem>
                <Text fontFamily={"$mono"}>End Time</Text>
                <TouchableOpacity onPress={() => setEndOpen(true)}>
                  <Text
                    fontFamily={"$mono"}
                    color={"#00cccc"}
                  >
                    {formatSessionDate(endDate.toISOString())}
                  </Text>
                </TouchableOpacity>
              </ListItem>
            </XStack>
          </YGroup.Item>
        </YGroup>
        {exercises.map((exercise: Types.ExerciseViewProp, i: number) => (
          <ExerciseAccordion
            exercise={exercise}
            key={i}
          />
        ))}
        <YGroup
          width={"100%"}
          separator={<Separator />}
        >
          <TouchableOpacity onPress={() => router.push("/(exercisesModal)")}>
            <YGroup.Item>
              <ListItem
                fontFamily={"$mono"}
                color={"#00cccc"}
                fontWeight={"$15"}
              >
                Add Exercise
              </ListItem>
            </YGroup.Item>
          </TouchableOpacity>
        </YGroup>

        <DatePicker
          modal
          open={startOpen}
          date={startDate}
          onConfirm={(date) => {
            setStartOpen(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setStartOpen(false);
          }}
        />
        <DatePicker
          modal
          open={endOpen}
          date={endDate}
          onConfirm={(date) => {
            setEndOpen(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setEndOpen(false);
          }}
        />
      </YStack>
    </ScrollView>
  );
};

export default ManualPost;
