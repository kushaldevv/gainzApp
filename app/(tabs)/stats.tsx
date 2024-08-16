import { useUser } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { Dimensions, useColorScheme } from "react-native";
import {
  Text,
  useTheme,
  YStack,
  View,
  Tabs,
  H5,
  Separator,
  ToggleGroup,
  XStack,
  Select,
  Adapt,
  Sheet,
  SelectProps,
  PortalProvider,
} from "tamagui";
import { LineChart } from "react-native-gifted-charts";
import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { LinearGradient } from "tamagui/linear-gradient";
const { width, height } = Dimensions.get("screen");

const Stats = () => {
  const { user } = useUser();
  const data = [{ value: 0 }, { value: 135 }, { value: 165 }, { value: 185 }, { value: 225 }];
  const [exerciseName, setExerciseName] = useState("Squats");
  return (
    <PortalProvider>
      <YStack
        flex={1}
        // alignItems="center"
        backgroundColor={"$background"}
        padding="$3"
        gap={"$5"}
      >
        <ToggleGroup
          type="single"
          display="flex"
        >
          <ToggleGroup.Item
            value="week"
            flex={1}
          >
            <Text
              fontFamily={"$mono"}
              fontWeight={500}
            >
              Last week
            </Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="month"
            flex={1}
          >
            <Text
              fontFamily={"$mono"}
              fontWeight={500}
            >
              Last Month
            </Text>
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value="year"
            flex={1}
          >
            <Text
              fontFamily={"$mono"}
              fontWeight={500}
            >
              Last Year
            </Text>
          </ToggleGroup.Item>
        </ToggleGroup>
        <XStack justifyContent="space-between">
          <MiniLineChartView />
          <MiniLineChartView />
        </XStack>
        <LineChartView />
      </YStack>
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
      width={width}
      overflow="hidden"
      alignSelf="center"
    >
      <LineChart
        areaChart
        isAnimated
        animateOnDataChange
        animationDuration={750}
        onDataChangeAnimationDuration={300}
        interpolateMissingValues
        width={width - 45} // Adjust this value as needed
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
        yAxisLabelWidth={30}
        rulesType="solid"
        rulesColor={"rgba(255,255,255,0.5)"}
        yAxisTextStyle={{ color: lightGray }}
        // yAxisLabelSuffix="lbs"
        xAxisColor={lightGray}
      />
    </View>
  );
};

const MiniLineChartView = () => {
  const theme = useTheme();
  const lightGray = theme.gray11.val;
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
    <View
      width={width / 2.25}
      height={width / 2.25}
      overflow="hidden"
      backgroundColor={"$gray2"}
      alignItems="center"
      borderRadius={"$4"}
    >
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
    </View>
  );
};

const items = [
  { name: "Apple" },
  { name: "Pear" },
  { name: "Blackberry" },
  { name: "Peach" },
  { name: "Apricot" },
  { name: "Melon" },
  { name: "Honeydew" },
  { name: "Starfruit" },
  { name: "Blueberry" },
  { name: "Raspberry" },
  { name: "Strawberry" },
  { name: "Mango" },
  { name: "Pineapple" },
  { name: "Lime" },
  { name: "Lemon" },
  { name: "Coconut" },
  { name: "Guava" },
  { name: "Papaya" },
  { name: "Orange" },
  { name: "Grape" },
  { name: "Jackfruit" },
  { name: "Durian" },
];

export default Stats;
