import React, { useState } from "react";
import { useColorScheme } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ScrollView, SizableText, useTheme, View, XStack, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import * as Types from "../../types";
import ExerciseAccordion from "../post/accordionItem";

const InnerCard = ({ exercises }: Types.InnerCardProps) => {
  const colorMode = useColorScheme();
  const gradientColor = colorMode === "dark" ? "#006666" : "#33e6e6";

  return (
    <XStack
      height={"$15"}
      justifyContent="space-between"
    >
      <LinearGradient
        width={"20%"}
        height={"$15"}
        p={"$3"}
        borderRadius="$6"
        colors={["#00cccc", gradientColor]}
        start={[1, 0]}
        end={[0, 1]}
      >
        <View
          height={"$4"}
          backgroundColor={"#009999"}
          borderRadius={"$3"}
          p="$2"
        >
          <Svg viewBox="0 0 512 512">
            <Path
              fill="#ffffff"
              d="M77.492 18.457l-17.726 3.127L69.09 74.47a1630.67 1630.67 0 0 0-15.8 2.54l-6.503-36.89-17.726 3.124 6.49 36.795a1877.847 1877.847 0 0 0-17.196 3.112l3.292 17.696c5.728-1.066 11.397-2.09 17.028-3.084l7.056 40.02 17.727-3.124-7.04-39.93c5.304-.88 10.57-1.725 15.798-2.54l9.777 55.45 17.727-3.126-9.697-54.99c8.483-1.218 16.866-2.338 25.18-3.38 15.54 46.39 34.697 99.995 66.936 134.448C190.86 250.992 192 268 214.56 310 192 348 176 412 167.21 471l-48 6v15H192c16-48 64-144 64-144s48 96 64 144h72.79v-15l-48-6C336 412 320 348 294 310c26-42 24.175-59.585 35.83-89.377 32.25-34.452 51.42-88.075 66.967-134.478 8.314 1.04 16.697 2.16 25.18 3.38l-9.696 54.99 17.728 3.124 9.777-55.45c5.23.815 10.494 1.66 15.8 2.54l-7.042 39.93 17.727 3.125 7.056-40.02c5.63.993 11.3 2.017 17.028 3.083l3.292-17.696c-5.78-1.075-11.507-2.11-17.195-3.113l6.49-36.796-17.727-3.125-6.504 36.89c-5.303-.88-10.57-1.727-15.8-2.54l9.324-52.886-17.726-3.127-9.406 53.35C365.982 63.31 310.982 59.04 256 59.04c-54.98 0-109.983 4.27-169.102 12.767l-9.406-53.35zM256 76.98c35.53 0 71.07 1.83 107.822 5.463-14.082 34.858-38.454 73.504-63.203 101.967C290.293 199.27 274.35 209 256 209c-18.35 0-34.294-9.73-44.62-24.59-24.748-28.463-49.12-67.11-63.202-101.967 36.75-3.633 72.29-5.463 107.822-5.463zM256 97c-20.835 0-39 20.24-39 47s18.165 47 39 47 39-20.24 39-47-18.165-47-39-47z"
            />
          </Svg>
        </View>
        <SizableText
          size={"$8"}
          fontFamily={"$mono"}
          fontWeight={600}
          alignSelf="center"
          pt="$3"
          col="white"
        >
          {exercises.reduce(
            (totalAcc, exercise) =>
              totalAcc + exercise.sets.reduce((setAcc, set) => setAcc + set.reps, 0),
            0
          )}
        </SizableText>
        <SizableText
          size={"$7"}
          fontFamily={"$mono"}
          fontWeight={400}
          alignSelf="center"
          lineHeight={"$5"}
          col={"white"}
        >
          Reps
        </SizableText>
      </LinearGradient>

      <YStack
        width={"77.5%"}
        height={"$15"}
        backgroundColor={"$gray3"}
        borderRadius={"$6"}
      >
        <ScrollView>
          {exercises.map((exercise, index) => (
            <YStack key={index}>
              <ExerciseAccordion
                exercise={exercise}
                inCard={true}
              />
            </YStack>
          ))}
        </ScrollView>
      </YStack>
    </XStack>
  );
};

export default InnerCard;
