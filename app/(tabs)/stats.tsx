import CustomBackdrop from "@/components/home/backdrop";
import DropDownMenu from "@/components/post/dropDownMenu";
import { daysFull, formatSessionDate } from "@/services/utilities";
import * as Types from "@/types";
import { BottomSheetModal, BottomSheetView, TouchableOpacity } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/elements";
import { ChevronRight, Search, Trash2, X } from "@tamagui/lucide-icons";
import React, { useCallback, useRef, useState } from "react";
import DatePicker from 'react-native-date-picker';
import { Input, ListItem, ScrollView, Separator, Text, useTheme, XStack, YGroup, YStack } from "tamagui";
import gainzExercises from '@/services/GainzExercises.json';
import { Stack } from "expo-router";

const targetMuscles = Object.keys(gainzExercises);

const exerciseSet1: Types.ExerciseSetViewProp = {
  reps: 12,
  weight: 189
}
const exerciseSet2: Types.ExerciseSetViewProp = {
  reps: 8,
  weight: 200
}

const exercise: Types.ExerciseViewProp = {
  name: "Back Squat",
  set: [exerciseSet1]
}


const Stats = () => {
  return (
    <Text>Stats</Text>
  )
  // const [startDate, setStartDate] = useState(new Date())
  // const [endDate, setEndDate] = useState(new Date())
  // const [startOpen, setStartOpen] = useState(false)
  // const [endOpen, setEndOpen] = useState(false)
  // const [exercises, setExercises] = useState<Types.ExerciseViewProp[]>([exercise]);
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // const headerHeight = useHeaderHeight();
  // const theme = useTheme();
  // const [query, setQuery] = useState("");

  // // const exercisesList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  // const handleChange = (text: string) => {
  //   setQuery(text);
  // };

  // const handlePresentModalPress = useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  // const handleDismissModalPress = useCallback(() => {
  //   bottomSheetModalRef.current?.dismiss();
  // }, []);

  // const deleteExercise = (exerciseName: string) => {

  // }

  // const addExercise = (exerciseName: string) => {
  //   const newExercise: Types.ExerciseViewProp = {
  //     name: exerciseName,
  //     set: []
  //   }
  //   setExercises([...exercises, newExercise])
  // }

  // const addExerciseSet = (exerciseName: string) => {
  //   const newExerciseSet: Types.ExerciseSetViewProp = {
  //     reps: 0,
  //     weight: 0
  //   }
  //   const updatedExercises = exercises.map(exercise => {
  //     if (exercise.name === exerciseName) {
  //       return {
  //         ...exercise,
  //         set: [...exercise.set, newExerciseSet]
  //       };
  //     }
  //     return exercise;
  //   });
  //   setExercises(updatedExercises);
  // }

  // const deleteExerciseSet = (exerciseName: string, index: number) => {
  //   const updatedExercises = exercises.map((exercise, i) => {
  //     if (exercise.name === exerciseName) {
  //       return {
  //         ...exercise,
  //         set: exercise.set.filter((_, i) => i !== index)
  //       };
  //     }
  //     return exercise;
  //   });
  //   setExercises(updatedExercises);
  // }

  // const modifyExerciseSetReps = (exerciseName: string, reps: number, index: number) => {
  //   const updatedExercises = exercises.map(exercise => {
  //     if (exercise.name === exerciseName) {
  //       exercise.set[index].reps = reps;
  //       return {
  //         ...exercise,
  //         set: [...exercise.set]
  //       };
  //     }
  //     return exercise;
  //   });
  //   setExercises(updatedExercises);
  // }

  // const modifyExerciseSetWeight = (exerciseName: string, weight: number, index: number) => {
  //   const updatedExercises = exercises.map(exercise => {
  //     if (exercise.name === exerciseName) {
  //       exercise.set[index].weight = weight;
  //       return {
  //         ...exercise,
  //         set: [...exercise.set]
  //       };
  //     }
  //     return exercise;
  //   });
  //   setExercises(updatedExercises);
  // }
 
  // return (
  //   <ScrollView backgroundColor={"$background"}>
  //   <YStack
  //     flex={1}
  //     alignItems="center"
  //     gap={"$4"}
  //     padding={"$3"}
  //   >
      
  //     <YGroup  separator={<Separator />}>
  //         <YGroup.Item>
  //           <Input borderWidth="$0" fontFamily={"$mono"} placeholder={daysFull[(new Date().getDay())] + '\'s workout'}></Input>
  //         </YGroup.Item>
  //         <YGroup.Item>
  //           {/* <ListItem title="Start Time"/> */}
  //           <XStack alignItems="center" justifyContent="space-between">
  //             <ListItem>
  //               <Text fontFamily={"$mono"}>Start Time</Text>
  //               <TouchableOpacity onPress={() => setStartOpen(true)}>
  //                 <Text fontFamily={"$mono"} color={"#00cccc"}>{formatSessionDate(startDate.toISOString())}</Text>
  //               </TouchableOpacity>
  //             </ ListItem>
  //           </XStack>
  //         </YGroup.Item>
  //         <YGroup.Item>
  //         {/* <ListItem title="End Time"/> */}
  //           <XStack alignItems="center" justifyContent="space-between">
  //               <ListItem>
  //                 <Text fontFamily={"$mono"}>End Time</Text>
  //                 <TouchableOpacity onPress={() => setEndOpen(true)}>
  //                   <Text fontFamily={"$mono"} color={"#00cccc"}>{formatSessionDate(endDate.toISOString())}</Text>
  //                 </TouchableOpacity>
  //               </ ListItem>
  //           </XStack>
  //         </YGroup.Item>
  //     </YGroup>

  //     {exercises.map((exercise: Types.ExerciseViewProp, i: number) => (
  //       <YGroup key={i} width={"100%"} separator={<Separator />}>
  //         <YGroup.Item>
  //             <ListItem p="$0">
  //               <Input borderWidth="0" fontFamily={"$mono"} fontSize="$5" placeholder="Exercise Name" fontWeight={"bold"} value={exercise.name} />
  //               <TouchableOpacity style={{position: "absolute", right: 12}}>
  //                 <DropDownMenu />
  //               </TouchableOpacity>
  //             </ListItem>
  //           </YGroup.Item>
  //           {exercise.set.map((set: Types.ExerciseSetViewProp, y: number) => (
  //             <YGroup.Item key={y}>
  //             <ListItem p="$0">
  //                 <XStack alignItems="center" justifyContent="space-between">
  //                   <YStack>
  //                     <Text fontFamily={"$mono"} pl="$3" pt="$1" pb="$0" fontSize={"$2"} opacity={0.7}>Reps</Text>
  //                     <Input width="$7" onChangeText={(text) => modifyExerciseSetReps(exercise.name, parseInt(text) || 0, y)} keyboardType="numeric" borderWidth="0" maxLength={3} fontFamily={"$mono"} placeholder="Reps" value={set.reps > 0 ? set.reps.toString() : ''} />

  //                   </YStack>
  //                   <YStack>
  //                     <Text fontFamily={"$mono"} pl="$4" pt="$1" pb="$0" fontSize={"$2"} opacity={0.7}>Weight</Text>
  //                     <Input width="$8" onChangeText={(text) => modifyExerciseSetWeight(exercise.name, parseInt(text) || 0, y)} keyboardType="numeric" borderWidth="0"  maxLength={4} fontFamily={"$mono"} placeholder="Weight" value={set.weight > 0 ? set.weight.toString() : ''}  />
  //                   </YStack>
  //                 </XStack>
  //                 <TouchableOpacity style={{position: "absolute", right: 10}}  onPress={() => deleteExerciseSet(exercise.name, y)}>
  //                     <Trash2
  //                           size={"$1"}
  //                           color={"$red10"}
  //                     />
  //                 </TouchableOpacity>
  //               </ListItem>
  //             </YGroup.Item>
  //           ))}
          
  //         <TouchableOpacity onPress={() => addExerciseSet(exercise.name)}>
  //           <YGroup.Item>
  //               <ListItem fontFamily={"$mono"} color={"#00cccc"} fontWeight={"$15"}>Add Set</ListItem>
  //           </YGroup.Item>
  //         </TouchableOpacity>
  //       </YGroup>))}

  //     <YGroup width={"100%"} separator={<Separator />}>
  //       <TouchableOpacity onPress={() => handlePresentModalPress()}>
  //           <YGroup.Item>
  //               <ListItem fontFamily={"$mono"} color={"#00cccc"} fontWeight={"$15"}>Add Exercise</ListItem>
  //           </YGroup.Item>
  //         </TouchableOpacity>
  //     </YGroup>
      
  //     <DatePicker
  //       modal
  //       open={startOpen}
  //       date={startDate}
  //       onConfirm={(date) => {
  //         setStartOpen(false)
  //         setStartDate(date)
  //       }}
  //       onCancel={() => {
  //         setStartOpen(false)
  //       }}
  //     />
  //     <DatePicker
  //       modal
  //       open={endOpen}
  //       date={endDate}
  //       onConfirm={(date) => {
  //         setEndOpen(false)
  //         setEndDate(date)
  //       }}
  //       onCancel={() => {
  //         setEndOpen(false)
  //       }}
  //     />
  //   </YStack>
  //     <BottomSheetModal
  //         ref={bottomSheetModalRef}
  //         index={0}
  //         snapPoints={["100%"]}
  //         // onChange={handleSheetChanges}
  //         backdropComponent={CustomBackdrop}
  //         handleIndicatorStyle={{ backgroundColor: theme.color.val }}
  //         backgroundStyle={{ backgroundColor: theme.gray3.val }}
  //         keyboardBehavior="interactive"
  //         keyboardBlurBehavior="restore"
  //         android_keyboardInputMode="adjustResize"
  //         // footerComponent={renderFooter}
  //         topInset={headerHeight}
  //       >
  //         <BottomSheetView>
  //             <YStack
  //               width={"100%"}
  //               height={"100%"}
  //               gap="$2"
  //               alignItems={"center"}
  //               p="$3"
  //             >
  //               <XStack
  //               alignItems="center"
  //               justifyContent="center"
  //             >
  //               <Input
  //                 flex={1}
  //                 pl="$8"
  //                 backgroundColor={"$gray4"}
  //                 textContentType="name"
  //                 placeholder="Search for exercises"
  //                 borderRadius="$10"
  //                 returnKeyType="search"
  //                 value={query}
  //                 onChangeText={(text) => handleChange(text)}
  //                 height={"$4"}
  //               />
  //               <Search
  //                 size="$1"
  //                 position="absolute"
  //                 left="$4"
  //               />
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   handleChange("");
  //                 }}
  //                 style={{ position: "absolute", right: 18 }}
  //               >
  //                 <X size="$1.5" />
  //               </TouchableOpacity>
  //             </XStack>
  //             <ScrollView width="100%" borderRadius={'$3'}>
  //             <YGroup alignSelf="center"  size="$5" paddingVertical="$3">
  //               {targetMuscles.map((target, i) => (
  //                 <YGroup.Item key={i}>
  //                   <ListItem
  //                     pressStyle={{ backgroundColor: "$gray2" }}
  //                     fontFamily={"$mono"}

  //                     iconAfter={ChevronRight}
  //                     backgroundColor={"$gray5"}
  //                     onPress={() => {
  //                       handleDismissModalPress();
  //                     }}
  //                   >{target} </ListItem>
  //                 </YGroup.Item>
  //               ))}
  //               </YGroup>
  //               </ScrollView> 
  //             </YStack>
  //         </BottomSheetView>
  //       </BottomSheetModal>
  //   </ScrollView>
  // );
};

export default Stats;