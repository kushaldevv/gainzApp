import { daysFull, formatSessionDate } from "@/services/utilities";
import * as Types from "@/types";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import DatePicker from "react-native-date-picker";
import {
	Button,
	Input,
	ListItem,
	ScrollView,
	Separator,
	Spinner,
	Text,
	XStack,
	YGroup,
	YStack,
	Circle,
	Square,
} from "tamagui";
import { ExercisesContext } from "./_layout";
import ExerciseAccordion from "@/components/post/accordionItem";
import { isLoaded } from "expo-font";
import { LinearGradient } from "tamagui/linear-gradient";
import { useColorScheme } from "react-native";
import { appendSession } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";
import { useShakeAnimation } from "@/components/auth/shakeAnimation";
import Animated from "react-native-reanimated";
import Stopwatch from "@/components/post/stopwatch";
import StopWatch from "@/components/post/stopwatch";
import { Pause, Play, Scale } from "@tamagui/lucide-icons";

const LivePost = () => {
	const [startDate, setStartDate] = useState(
		new Date(new Date().getTime() - 60 * 60 * 1000)
	);
	const [endDate, setEndDate] = useState(new Date());
	const [startOpen, setStartOpen] = useState(false);
	const [endOpen, setEndOpen] = useState(false);
	const { exercises, setExercises } = useContext(ExercisesContext);
	const [loading, setLoading] = useState(false);
	const colorMode = useColorScheme();
	const gradientColor = colorMode === "dark" ? "#006666" : "#33e6e6";
	const [workoutName, setWorkoutName] = useState("");
	const [location, setLocation] = useState("");
	const workoutPlaceholder = daysFull[new Date().getDay()] + "'s workout";
	const locationPlaceholder = "Earth, Milky Way Galaxy";
	const { user } = useUser();
	const [error, setError] = useState(false);
	const shake = useShakeAnimation(error);
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	const startStopTimer = () => {
    console.log(isRunning);
		setIsRunning(!isRunning);
	};

  const reset = () => {
    setTime(0);
  }

	const validatePost = () => {
		if (exercises.length === 0) {
			return false;
		}

		let output = true;
		exercises.forEach((exercise) => {
			if (exercise.sets.length === 0) {
				output = false;
				return;
			}
			exercise.sets.forEach((set) => {
				if (set.reps === 0 || set.weight === 0) {
					output = false;
					return;
				}
			});
		});
		return output;
	};

	const onPressPost = async () => {
		setLoading(true);

		if (!isLoaded || !validatePost()) {
			setLoading(false);
			setError(true);
			await new Promise((resolve) => setTimeout(resolve, 1));
			setError(false);
			console.log("Error posting");
			return;
		}

		const sessionKey = `${user?.id}session_${new Date().getTime()}`;
		const session = {
			sessionKey: sessionKey,
			sessionData: {
				name: workoutName ? workoutName : workoutPlaceholder,
				likes: [],
				exercises: exercises.map((exercise) => exercise.name),
				comments: [],
				location: location ? location : locationPlaceholder,
				duration: 4000,
				date: startDate,
			},
			exerciseData: exercises.map((exercise) => ({
				name: exercise.name,
				sessionId: sessionKey,
				lists: {
					reps: exercise.sets.map((set) => set.reps),
					weight: exercise.sets.map((set) => set.weight),
				},
			})),
		};

		if (user) await appendSession(user.id, session);

		setLoading(false);
	};

	return (
		<ScrollView backgroundColor={"$background"}>
			<YStack flex={1} alignItems="center" gap={"$4"} padding={"$3"}>

				<StopWatch time={time} isRunning={isRunning} modifyTime={(time: number) => setTime(time)} />

				{exercises.map((exercise: Types.ExerciseViewProp, i: number) => (
					<ExerciseAccordion exercise={exercise} key={i} />
				))}
				<YGroup width={"100%"} separator={<Separator />}>
					<TouchableOpacity
						onPress={() =>
							router.push({
								pathname: "/(exercisesModal)",
								params: { source: "live" },
							})
						}
					>
						<YGroup.Item>
							<ListItem
								fontFamily={"$mono"}
								color={"#00cccc"}
								fontWeight={"$15"}
							>
								Add Exercise
							</ListItem>
						</YGroup.Item>
						<YGroup separator={<Separator />} width={"100%"} mt="$5">
							<YGroup.Item>
								<Input
									borderWidth="$0"
									fontFamily={"$mono"}
									placeholder={workoutPlaceholder}
									value={workoutName} // Bind the input value to the state
									onChangeText={setWorkoutName} // Update the state when the input value changes
								></Input>
							</YGroup.Item>
							<YGroup.Item>
								<Input
									borderWidth="$0"
									fontFamily={"$mono"}
									placeholder="Location"
									value={location} // Bind the input value to the state
									onChangeText={setLocation} // Update the state when the input value changes
								></Input>
							</YGroup.Item>
						</YGroup>
					</TouchableOpacity>
				</YGroup>
        <LinearGradient
						width={"$8"}
						height={"$8"}
						alignItems="center"
            alignSelf="center"
            
						justifyContent="center"
						borderRadius="$12"
						colors={["#00cccc", gradientColor]}
						start={[1, 0]}
						end={[0, 1]}
						pressStyle={{ scale: 0.85 }}
						animation="100ms"
						onPress={() => {
							// onPressPost();
							startStopTimer();
						}}
						disabled={!isLoaded}
					>
						{loading ? (
							<Spinner size="small" color="$accentColor" />
						) : (
							<>
								{isRunning ? (
									<Square
										size={"$2"}
										backgroundColor="$white1"
										elevation="$4"
									/>
								) : (
									<Play size="$3" fill="white" color="$white" />
								)}
							</>
						)}
					</LinearGradient>
          <Button onPress={reset}>Reset</Button>
			</YStack>
		</ScrollView>
	);
};

export default LivePost;
