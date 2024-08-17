import { useUser } from "@clerk/clerk-expo";
import { ChevronDown, X } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
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
const { width, height } = Dimensions.get("screen");

const Stats = () => {
  const { user } = useUser();
  const data = [{ value: 0 }, { value: 135 }, { value: 165 }, { value: 185 }, { value: 225 }];
  const [exerciseName, setExerciseName] = useState("Squats");
  const [dateRange, setDateRange] = useState("Monthly");
  return (
    <PortalProvider>
      <ScrollView backgroundColor={"$background"}>
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
            <YStack flex={1}>
              <TouchableOpacity>
                <XStack
                  gap="$2"
                  alignItems="center"
                >
                  <Text
                    fontSize={"$5"}
                    fontFamily={"$mono"}
                    fontWeight={800}
                    col={"$red10"}
                  >
                    {exerciseName}
                  </Text>
                  <ChevronDown size={"$1"} />
                </XStack>
              </TouchableOpacity>
              <Text
                fontFamily={"$mono"}
                col={"$gray11"}
              >
                PR: 100 lbs
              </Text>
            </YStack>

            <Button
              width={"$11"}
              fontFamily={"$mono"}
              fontWeight={500}
              fontSize={"$4"}
              iconAfter={<ChevronDown size={"$1"} />}
              alignSelf="flex-start"
            >
              {dateRange}
            </Button>
          </XStack>
          <XStack justifyContent="space-between">
            <MiniLineChartView label="Reps" />
            <MiniLineChartView label="Weight" />
          </XStack>
          <Text
            alignSelf="center"
            fontFamily={"$mono"}
            fontWeight={600}
            fontSize={"$5"}
          >
            Weight per Rep
          </Text>
          <LineChartView />
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
