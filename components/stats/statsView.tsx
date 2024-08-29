import { getExerciseStats, getUserExercises } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";
import { ChevronDown } from "@tamagui/lucide-icons";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import { Dimensions, Modal, TouchableOpacity, useColorScheme } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import {
  Button,
  Image,
  PortalProvider,
  ScrollView,
  Text,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";
import * as DropdownMenu from "zeego/dropdown-menu";
import * as Types from "../../types";
const { width, height } = Dimensions.get("screen");

const StatsView = ({ userID }: { userID: string }) => {
  const skeletonColorScheme = useColorScheme() == "dark" ? "dark" : "light";
  const theme = useTheme();
  const lightGray = theme.gray11.val;
  const accent = "#00cccc";

  const [exerciseList, setExerciseList] = useState<string[]>([]);
  const [exercise, setExercise] = useState<Types.ExerciseStats | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");

  const [loadingNames, setLoadingNames] = useState(true);
  // 
  const [loadingStats, setLoadingStats] = useState(false);

  const [dateRange, setDateRange] = useState("Bi-Weekly");
  const [graphData, setGraphData] = useState<Types.GraphsData>({
    repsPoints: [],
    weightPoints: [],
    wprPoints: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const [showGraphs, setShowGraphs] = useState(true);

  useEffect(() => {
    fetchUserExcercises();
  }, []);

  const fetchUserExcercises = async () => {
    try {
      const exercises = await getUserExercises(userID);
      setExerciseList(exercises);
      const firstExercise = exercises[0];
      setExerciseName(firstExercise);
      await fetchExerciseStat(firstExercise);
    } catch (error) {
      console.log(error);
    }
    setLoadingNames(false);
  };

  useEffect(() => {
    if (exerciseName) {
      fetchExerciseStat(exerciseName);
    }
  }, [exerciseName]);

  const fetchExerciseStat = async (exerciseName: string) => {
    setLoadingStats(true);
    try {
      const exerciseStats = await getExerciseStats(userID, exerciseName);
      if (exerciseStats.sessionsSetStats.length < 4) {
        setShowGraphs(false);
      } else {
        setShowGraphs(true);
      }
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
    setGraphData({
      repsPoints: repsPoints,
      weightPoints: weightPoints,
      wprPoints: wprPoints,
    });
    setLoadingStats(false);
  };

  return (
    <PortalProvider>
      <ScrollView
        backgroundColor={"$background"}
        scrollEnabled={false}
      >
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
              {showGraphs ? (
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
              ) : null}
            </Skeleton>
          </XStack>
          <Skeleton.Group show={loadingStats}>
            <XStack justifyContent="space-between">
              <Skeleton
                width={width / 2.25}
                height={width / 2}
                colorMode={skeletonColorScheme}
              >
                {showGraphs && graphData.repsPoints.length > 3 ? (
                  <MiniLineChartView
                    label="Reps"
                    data={graphData.repsPoints}
                  />
                ) : null}
              </Skeleton>
              <Skeleton
                width={width / 2.25}
                height={width / 2}
                colorMode={skeletonColorScheme}
              >
                {showGraphs && graphData.weightPoints.length > 3 ? (
                  <MiniLineChartView
                    label="Weight"
                    data={graphData.weightPoints}
                  />
                ) : null}
              </Skeleton>
            </XStack>
            <Skeleton
              colorMode={skeletonColorScheme}
              width={"100%"}
              height={height / 3 + 50}
            >
              <>
                <Text
                  alignSelf="center"
                  fontFamily={"$mono"}
                  fontWeight={600}
                  fontSize={"$5"}
                >
                  {showGraphs ? "Weight per Rep" : "Not enough Data"}
                </Text>
                <View
                  // width={width}
                  // overflow='visible'
                  // alignSelf="center"
                  // alignItems="center"
                  // mr={50}
                >
                  {showGraphs && graphData.wprPoints.length > 3 && (
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
                      width={width - 80}
                      height={height / 3}
                      
                      adjustToWidth
                      // hideDataPoints
                      textShiftY={-6}
                      textColor1={theme.color.val}
                      dataPointsColor={theme.color.val}
                      dataPointsRadius={5}
                      // spacing={70}ad
                      color1={accent}
                      startFillColor1={accent}
                      endFillColor1={accent}
                      startOpacity={0.85}
                      endOpacity={0.1}
                      initialSpacing={6}
                      
                      noOfSections={4}
                      // hideRules
                      yAxisThickness={0}
                      yAxisLabelWidth={50}
                      rulesType="solid"
                      rulesColor={"rgba(255,255,255,0.5)"}
                      yAxisTextStyle={{ color: lightGray }}
                      
                      yAxisLabelSuffix="lbs"
                      xAxisColor={lightGray}
                      onPress={(item: any, index: number) => {
                        setModalImage(item.image);
                        if (item.image) {
                          setModalVisible(true);
                        }
                      }}
                    />
                  )}
                </View>
              </>
            </Skeleton>
          </Skeleton.Group>
        </YStack>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {/* <View style={styles.centeredView}> */}
        <View
          flex={1}
          alignItems="center"
          justifyContent="center"
          padding="$4"
          backgroundColor={"rgba(0,0,0,0.75)"}
        >
          {/* <View> */}
          <Image
            width="100%"
            height="50%"
            alignSelf="center"
            source={{
              uri: modalImage,
            }}
            borderWidth="$1"
            borderRadius={"$5"}
            borderColor={"$color"}
          />

          <TouchableOpacity
            style={{ marginTop: 15 }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <View
              borderRadius={"$8"}
              overflow="hidden"
            >
              <Text
                fontFamily={"$mono"}
                fontWeight={600}
                backgroundColor={accent}
                p="$3"
              >
                Dismiss
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </PortalProvider>
  );
};

export default StatsView;
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
  const lowestValue = Math.min(...data.map((point) => (point.value ? point.value : 9999)));
  const accent = "#00cccc";
  return (
    <YStack
      width={width / 2.25}
      height={width / 2}
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
        {label} {label === "Reps" ? "" : "(lbs)"}
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
        height={width / 2}
        adjustToWidth
        data={data}
        // hideDataPoints
        dataPointsColor={theme.color.val}
        // spacing={35}
        color1={accent}
        startFillColor1={accent}
        endFillColor1={accent}
        startOpacity={0.85}
        endOpacity={0.1}
        initialSpacing={6}
        yAxisExtraHeight={-5}
        yAxisThickness={0}
        yAxisLabelWidth={0}
        xAxisLabelsHeight={0}
        hideRules
        rulesColor={"rgba(255,255,255,0.5)"}
        textShiftY={-10}
        textColor1={theme.color.val}
        yAxisOffset={label === "Reps" ? 0 : lowestValue - 10}
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

const generateDates = (
  range: string,
  sessionsSetStats: Types.SessionSetStats[],
  graphType: string
): Types.GraphPoint[] => {
  const date = new Date();
  const data: Types.GraphPoint[] = [];

  // let initialPointFlag = false;
  let firstPointIndex = -1;
  let lastPointIndex = -1;
  switch (range) {
    case "Bi-Weekly":
      for (let i = 13; i >= 0; i--) {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - i);
        const dateString = newDate.toISOString().split("T")[0];
        let value : number = 0;
        let image: string | undefined = undefined;
        sessionsSetStats.forEach((sessionSetStats: Types.SessionSetStats) => {
          if (sessionSetStats.date.split("T")[0] === dateString) {
            // initialPointFlag = true;
            if (firstPointIndex === -1) firstPointIndex = i;
            lastPointIndex = i;
            if (sessionSetStats.image) image = sessionSetStats.image;
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
        // if (firstPointIndex != -1) {
          if (value) {
            if (graphType === "Reps" || graphType === "Weight") {
              data.push({
                value: value,
                dataPointText: value.toFixed(2),
                date: dateString,
              } as Types.GraphPoint);
            } else {
              data.push({
                value: value,
                dataPointText: value.toFixed(2),
                date: dateString,
                image: image,
              } as Types.GraphPoint);
            }
          } else {
            i > 0 && data.push({ date: dateString } as Types.GraphPoint);
          }
          // data = data.slice(firstPointIndex, lastPointIndex + 1);
        // }
      }
  }
  return data.slice(14 - firstPointIndex - 1, 14 - lastPointIndex);
};