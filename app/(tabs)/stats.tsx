import { getExerciseStats, getUserExercises } from "@/services/apiCalls";
import { getMuscleColor } from "@/services/utilities";
import { useUser } from "@clerk/clerk-expo";
import { ChevronDown, X } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, useColorScheme } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
  Button,
  H4,
  H5,
  Label,
  PortalProvider,
  RadioGroup,
  ScrollView,
  Text,
  ToggleGroup,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";
import * as DropdownMenu from "zeego/dropdown-menu";
import * as Types from "../../types";
import { Skeleton } from "moti/skeleton";
const { width, height } = Dimensions.get("screen");

// const test: Types.ExerciseStats = {
//   name: "Band bench press",
//   muscle: "Chest",
//   PR: 205,
//   sessionsSets: [
//     [
//       { reps: 3, weight: 80, date: "2022-01-01" },
//       { reps: 3, weight: 85 },
//       { reps: 3, weight: 90 },
//     ],
//     [
//       { reps: 3, weight: 80, date: "2022-01-01" },
//       { reps: 3, weight: 85 },
//       { reps: 3, weight: 90 },
//     ],
//     [
//       { reps: 3, weight: 80, date: "2022-01-01" },
//       { reps: 3, weight: 85 },
//       { reps: 3, weight: 90 },
//     ],
//   ],
// };

// const tes2: Types.ExerciseStats = {
//   name: "Barbell curl",
//   muscle: "Biceps",
//   PR: 90,
//   sessionsSets: [
//     [
//       { reps: 3, weight: 80, date: "2022-01-01" },
//       { reps: 3, weight: 85 },
//       { reps: 3, weight: 90 },
//     ],
//     [
//       { reps: 3, weight: 80, date: "2022-01-01" },
//       { reps: 3, weight: 85 },
//       { reps: 3, weight: 90 },
//     ],
//     [
//       { reps: 3, weight: 80, date: "2022-01-01" },
//       { reps: 3, weight: 85 },
//       { reps: 3, weight: 90 },
//     ],
//   ],
// };

const Stats = () => {
  const { user } = useUser();
  const skeletonColorScheme = useColorScheme() == "dark" ? "dark" : "light";

  const data = [{ value: 0 }, { value: 135 }, { value: 165 }, { value: 185 }, { value: 225 }];
  const [exerciseList, setExerciseList] = useState<string[]>([]);
  const [exercise, setExercise] = useState<Types.ExerciseStats | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");

  const [loadingNames, setLoadingNames] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [dateRange, setDateRange] = useState("Bi-Weekly");

  useEffect(() => {
    fetchUserExcercises();
    setLoadingStats(true);
  }, []);

  const fetchUserExcercises = async () => {
    setLoadingNames(true);
    try {
      if (user) {
        const exercises = await getUserExercises(user?.id);
        setExerciseList(exercises);
        setExerciseName(exercises[0]);
        // fetchExerciseStat();
      }
    } catch (error) {
      console.log(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoadingNames(false);
  };

  const fetchExerciseStat = async () => {
    setLoadingStats(true);
    try {
      if (!user) return;
      console.log(exerciseName);
      const exerciseStats = await getExerciseStats(user?.id, exerciseName);
      setExercise(exerciseStats);
      console.log(exerciseStats);
    } catch (error) {
      console.log(error);
    }
    setLoadingStats(false);
  };

  // useEffect(() => {
  //   fetchExerciseStat(exerciseName);
  // }, [exerciseName]);

  return (
    <PortalProvider>
      <ScrollView backgroundColor={"$background"}>
        <Button onPress={() => fetchExerciseStat()}>test</Button>
        <YStack
          backgroundColor={"$background"}
          padding="$3"
          gap={"$4"}
        >
          <XStack
            justifyContent="space-between"
            alignItems="flex-start"
            // width={"100%"}
          >
            <Skeleton
              show={loadingNames}
              colorMode={skeletonColorScheme}
            >
              <YStack flex={1}>
                <TouchableOpacity>
                  <DropDownMenu
                    items={exerciseList}
                    setExerciseName={setExerciseName}
                  >
                    <XStack
                      gap="$2"
                      alignItems="center"
                    >
                      <Text
                        fontSize={"$5"}
                        fontFamily={"$mono"}
                        fontWeight={800}
                        // col={getMuscleColor(exercise.muscle)}
                      >
                        {exerciseName}
                      </Text>
                      <ChevronDown size={"$1"} />
                    </XStack>
                  </DropDownMenu>
                </TouchableOpacity>
                {!loadingStats && (
                  <Text
                    fontFamily={"$mono"}
                    col={"$gray11"}
                  >
                    {"PR: " + exercise?.PR + " lbs"}
                  </Text>
                )}
              </YStack>
            </Skeleton>
            <Skeleton
              show={loadingStats}
              colorMode={skeletonColorScheme}
            >
              <DropDownMenu items={["Bi-Weekly", "1 Month", "3 Months", "6 Months", "12 Months"]}>
                <Button
                  // width={"$12"}
                  fontFamily={"$mono"}
                  fontWeight={500}
                  fontSize={"$4"}
                  iconAfter={<ChevronDown size={"$1"} />}
                  alignSelf="flex-start"
                >
                  {dateRange}
                </Button>
              </DropDownMenu>
            </Skeleton>
          </XStack>
          <Skeleton.Group show={loadingStats}>
            <XStack justifyContent="space-between">
              <Skeleton colorMode={skeletonColorScheme}>
                <MiniLineChartView label="Reps" />
              </Skeleton>
              <Skeleton colorMode={skeletonColorScheme}>
                <MiniLineChartView label="Weight" />
              </Skeleton>
            </XStack>
            <Skeleton colorMode={skeletonColorScheme}>
              <>
                <Text
                  alignSelf="center"
                  fontFamily={"$mono"}
                  fontWeight={600}
                  fontSize={"$5"}
                >
                  Weight per Rep
                </Text>
                <LineChartView />
              </>
            </Skeleton>
          </Skeleton.Group>
        </YStack>
      </ScrollView>
    </PortalProvider>
  );
};

const LineChartView = () => {
  const theme = useTheme();
  const lightGray = theme.gray11.val;
  const accent = "#00cccc";

  const data1 = [
    { value: 70, date: "1 Apr" },
    { value: 36, label: "5 Apr", labelTextStyle: { color: lightGray, width: 60 } },
    { value: 50, label: "10 Apr", labelTextStyle: { color: lightGray, width: 60 } },
    { value: 40, label: "15 Apr", labelTextStyle: { color: lightGray, width: 60 } },
    { value: 18, label: "20 Apr", labelTextStyle: { color: lightGray, width: 60 } },
    { value: 38, date: "25 Apr" },
  ];
  return (
    <View
      // width={width}
      // overflow="hidden"
      alignSelf="center"
      alignItems="center"
      mr={30}
    >
      <LineChart
        areaChart
        isAnimated
        animateOnDataChange
        animationDuration={750}
        onDataChangeAnimationDuration={300}
        interpolateMissingValues
        width={width - 56} // Adjust this value as needed
        height={height / 3}
        adjustToWidth
        data={data1}
        hideDataPoints
        // spacing={70}
        color1={accent}
        startFillColor1={accent}
        endFillColor1={accent}
        startOpacity={0.85}
        endOpacity={0.1}
        initialSpacing={0}
        noOfSections={4}
        yAxisThickness={0}
        yAxisLabelWidth={25}
        rulesType="solid"
        rulesColor={"rgba(255,255,255,0.5)"}
        yAxisTextStyle={{ color: lightGray }}
        // yAxisLabelSuffix="lbs"
        xAxisColor={lightGray}
      />
    </View>
  );
};

const MiniLineChartView = ({ label }: { label: string }) => {
  const theme = useTheme();
  const accent = "#00cccc";

  const data1 = [
    { value: 70 },
    { value: 36 },
    { value: 50 },
    { value: 40 },
    { value: 18 },
    { value: 38 },
  ];
  return (
    <YStack
      width={width / 2.25}
      height={width / 2.25}
      overflow="hidden"
      backgroundColor={"$gray2"}
      alignItems="center"
      borderRadius={"$4"}
    >
      <Text
        fontFamily={"$mono"}
        fontWeight={600}
        fontSize={"$5"}
      >
        {label}
      </Text>
      <LineChart
        endSpacing={0}
        areaChart
        isAnimated
        animateOnDataChange
        animationDuration={750}
        onDataChangeAnimationDuration={300}
        interpolateMissingValues
        width={width / 2.25} // Adjust this value as needed
        height={width / 2.25}
        adjustToWidth
        data={data1}
        hideDataPoints
        // spacing={35}
        color1={accent}
        startFillColor1={accent}
        endFillColor1={accent}
        startOpacity={0.85}
        endOpacity={0.1}
        initialSpacing={0}
        yAxisThickness={0}
        yAxisLabelWidth={0}
        xAxisLabelsHeight={0}
        hideRules
        rulesColor={"rgba(255,255,255,0.5)"}
        // yAxisTextStyle={{ color: lightGray }}
        // yAxisLabelSuffix="lbs"
        // xAxisColor={lightGray}
      />
    </YStack>
  );
};

const DropDownMenu = ({
  children,
  items,
  setExerciseName,
}: {
  children: any;
  items: string[];
  setExerciseName?: any;
}) => {
  const handleSelect = (item: string) => {
    if (setExerciseName) {
      setExerciseName(item);
    }
  };
  return (
    <DropdownMenu.Root style={{ maxHeight: 200 }}>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content
        loop={false}
        side="bottom"
        align="start"
        alignOffset={0}
        avoidCollisions={false}
        collisionPadding={8}
        sideOffset={0}
      >
        {items.map((item, index) => {
          return (
            <DropdownMenu.Item
              key={index.toString()}
              onSelect={() => handleSelect(item)}
            >
              <DropdownMenu.ItemTitle>{item}</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Stats;
