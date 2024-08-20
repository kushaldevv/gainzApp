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

const data1 = [
  { value: 0 },
  { value: null },
  { value: 50 },
  { value: 40 },
  { value: 18 },
  { value: 38 },
];

const testdata = [
  { date: "2024-08-13", value: 60.90909090909091 },
  { date: "2024-08-14" },
  { date: "2024-08-15" },
  { date: "2024-08-16", value: 61.25 },
  { date: "2024-08-17" },
  { date: "2024-08-18" },
  { date: "2024-08-19", value: 63.541666666666664 },
];

const Stats = () => {
  const { user } = useUser();
  const skeletonColorScheme = useColorScheme() == "dark" ? "dark" : "light";
  const theme = useTheme();
  const lightGray = theme.gray11.val;
  const accent = "#00cccc";

  const [exerciseList, setExerciseList] = useState<string[]>([]);
  const [exercise, setExercise] = useState<Types.ExerciseStats | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");

  const [loadingNames, setLoadingNames] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const [dateRange, setDateRange] = useState("Bi-Weekly");
  const [graphData, setGraphData] = useState<Types.GraphsData>({
    repsPoints: [],
    weightPoints: [],
    wprPoints: [],
  });

  useEffect(() => {
    fetchUserExcercises();
  }, []);

  const fetchUserExcercises = async () => {
    try {
      if (user) {
        const exercises = await getUserExercises(user?.id);
        setExerciseList(exercises);
        const firstExercise = exercises[0];
        setExerciseName(firstExercise);
        await fetchExerciseStat(firstExercise);
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingNames(false);
  };

  const fetchExerciseStat = async (exerciseName: string) => {
    setLoadingStats(true);
    try {
      if (!user) return;
      const exerciseStats = await getExerciseStats(user?.id, exerciseName);
      setExercise(exerciseStats);
      fetchGraphData("Bi-Weekly", exerciseStats.sessionsSetStats);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGraphData = (range: string, sessionsSetStats: Types.SessionSetStats[]) => {
    // console.log(sessionsSetStats);
    const repsPoints = generateDates(range, sessionsSetStats, "Reps");
    const weightPoints = generateDates(range, sessionsSetStats, "Weight");
    const wprPoints = generateDates(range, sessionsSetStats, "WPR");
    // setGraphData({ repsPoints: repsPoints, weightPoints: weightPoints, wprPoints: wprPoints });
    console.log(wprPoints);
    setGraphData({
      repsPoints: repsPoints,
      weightPoints: weightPoints,
      wprPoints: wprPoints,
    });
    setLoadingStats(false);
  };

  return (
    <PortalProvider>
      <ScrollView backgroundColor={"$background"}>
        {/* <Button onPress={() => fetchExerciseStat()}>test</Button> */}
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

                <Text
                  fontFamily={"$mono"}
                  col={"$gray11"}
                  height={"$1"}
                >
                  {!loadingStats && "PR: " + (exercise && exercise?.PR) + " lbs"}
                </Text>
              </YStack>
            </Skeleton>
            <Skeleton
              show={loadingStats}
              colorMode={skeletonColorScheme}
            >
              <DropDownMenu items={["Bi-Weekly", "1 Month", "3 Months", "6 Months", "1 Year"]}>
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
                {graphData.repsPoints.length > 0 ? (
                  <MiniLineChartView
                    label="Reps"
                    data={graphData.repsPoints}
                  />
                ) : null}
              </Skeleton>
              <Skeleton colorMode={skeletonColorScheme}>
                {graphData.weightPoints.length > 0 ? (
                  <MiniLineChartView
                    label="Weight"
                    data={graphData.weightPoints}
                  />
                ) : null}
              </Skeleton>
            </XStack>
            <Skeleton
              colorMode={skeletonColorScheme}
              show={false}
            >
              <>
                <Text
                  alignSelf="center"
                  fontFamily={"$mono"}
                  fontWeight={600}
                  fontSize={"$5"}
                >
                  Weight per Rep
                </Text>
                <View
                  // width={width}
                  // overflow="hidden"
                  alignSelf="center"
                  alignItems="center"
                  mr={50}
                >
                  {graphData.wprPoints.length > 0 && (
                    // graphData.wprPoints.map((point, index) => (
                    //   <Text key={index}>{point.value + ' ' + point.date}</Text>
                    // ))
                    <LineChart
                      data={graphData.wprPoints}
                      areaChart
                      isAnimated
                      animateOnDataChange
                      animationDuration={750}
                      onDataChangeAnimationDuration={300}
                      interpolateMissingValues
                      width={width - 80} // Adjust this value as needed
                      height={height / 3}
                      adjustToWidth
                      hideDataPoints
                      // spacing={70}
                      color1={accent}
                      startFillColor1={accent}
                      endFillColor1={accent}
                      startOpacity={0.85}
                      endOpacity={0.1}
                      initialSpacing={0}
                      noOfSections={4}
                      // hideRules
                      yAxisThickness={0}
                      yAxisLabelWidth={50}
                      rulesType="solid"
                      rulesColor={"rgba(255,255,255,0.5)"}
                      yAxisTextStyle={{ color: lightGray }}
                      yAxisLabelSuffix="lbs"
                      xAxisColor={lightGray}
                    />
                  )}
                </View>
              </>
            </Skeleton>
          </Skeleton.Group>
        </YStack>
      </ScrollView>
    </PortalProvider>
  );
};

// const LineChartView = () => {
//   const theme = useTheme();
//   const lightGray = theme.gray11.val;
//   const accent = "#00cccc";

//   const data1 = [
//     { value: 70, date: "1 Apr" },
//     { value: null, label: "5 Apr", labelTextStyle: { color: lightGray, width: 60 } },
//     { value: 50, label: "10 Apr", labelTextStyle: { color: lightGray, width: 60 } },
//     { value: 40, label: "15 Apr", labelTextStyle: { color: lightGray, width: 60 } },
//     { value: 18, label: "20 Apr", labelTextStyle: { color: lightGray, width: 60 } },
//     { value: 38, date: "25 Apr" },
//   ];
//   return (
//     <View
//       // width={width}
//       // overflow="hidden"
//       alignSelf="center"
//       alignItems="center"
//       mr={30}
//     >
//       <LineChart
//         areaChart
//         isAnimated
//         animateOnDataChange
//         animationDuration={750}
//         onDataChangeAnimationDuration={300}
//         interpolateMissingValues
//         width={width - 56} // Adjust this value as needed
//         height={height / 3}
//         adjustToWidth
//         data={data1}
//         hideDataPoints
//         // spacing={70}
//         color1={accent}
//         startFillColor1={accent}
//         endFillColor1={accent}
//         startOpacity={0.85}
//         endOpacity={0.1}
//         initialSpacing={0}
//         noOfSections={4}
//         yAxisThickness={0}
//         yAxisLabelWidth={25}
//         rulesType="solid"
//         rulesColor={"rgba(255,255,255,0.5)"}
//         yAxisTextStyle={{ color: lightGray }}
//         // yAxisLabelSuffix="lbs"
//         xAxisColor={lightGray}
//       />
//     </View>
//   );
// };

const MiniLineChartView = ({ label, data }: { label: string; data: Types.GraphPoint[] }) => {
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
        data={data}
        // hideDataPoints
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

const generateDates = (
  range: string,
  sessionsSetStats: Types.SessionSetStats[],
  graphType: string
): Types.GraphPoint[] => {
  const date = new Date();
  const data: Types.GraphPoint[] = [];
  let initialPointFlag = false;
  switch (range) {
    case "Bi-Weekly":
      for (let i = 13; i >= 0; i--) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - i);
        const dateString = newDate.toISOString().split("T")[0];
        let value = null;
        sessionsSetStats.forEach((sessionSetStats: Types.SessionSetStats) => {
          if (sessionSetStats.date.split("T")[0] === dateString) {
            initialPointFlag = true;
            if (graphType === "Reps") {
              value = sessionSetStats.reps.reduce((a: number, b: number) => a + b, 0);
            } else if (graphType === "Weight") {
              value = Math.max(...sessionSetStats.weight);
            } else if (graphType === "WPR") {
              value =
                sessionSetStats.weight.reduce(function (r, a, i) {
                  return r + a * sessionSetStats.reps[i];
                }, 0) / sessionSetStats.reps.reduce((a: number, b: number) => a + b, 0);
            }
          }
        });
        if (initialPointFlag) {
          if (value) {
            data.push({ value: value, date: dateString } as Types.GraphPoint);
          } else {
            i > 0 && data.push({ date: dateString } as Types.GraphPoint);
          }
        }
      }
  }
  return data;
};
