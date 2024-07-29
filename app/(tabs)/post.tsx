// import { appendSession } from "@/services/apiCalls";
// import React, { useState } from "react";
// import { YStack, Button, Input, XStack } from "tamagui";
// import * as Types from "@/types";
// import { useUser } from "@clerk/clerk-expo";
// //

// const Post = () => {
//   const [sessionName, setSessionName] = useState("");
//   const [location, setLocation] = useState("");
//   const [duration, setDuration] = useState(0);

//   const [exerciseName, setExerciseName] = useState("");
//   const [reps, setReps] = useState(0);
//   const [weight, setWeight] = useState(0);
//   const {user} = useUser();

//   const postSession = async () => {
//     console.log("Posting session...");
//     const sessionKey = `${user?.id}session_${new Date().getTime()}`;
//     sessionKey.split('session')[0]
//     console.log(sessionKey);
//     const newSession = {
//       "sessionKey": sessionKey,
//       "sessionData": {
//         "name": sessionName,
//         "likes": [],
//         "exercises": {
//           [exerciseName]: {
//             reps: [reps],
//             weight: [weight],
//           },
//           ['Incline dumbell bench press']: {
//             reps: [10, 8, 6],
//             weight: [135, 185, 205],
//           },
//           ['Pendelum squat']: {
//             reps: [12, 12, 15],
//             weight: [45, 90, 70],
//           },
//         },
//         "comments": [],
//         "location": location,
//         "duration": duration,
//         "date": new Date().toISOString()
//       }
//     };
//     if (user)
//       await appendSession(user?.id, newSession)
//   };
//   return (
//     <YStack
//       flex={1}
//       alignItems="center"
//       backgroundColor={"$background"}
//       gap={"$4"}
//       pt={"$4"}
//     >
//       <Input
//         onChangeText={(text) => setSessionName(text)}
//         placeholder="Session name"
//       />
//       <Input
//         onChangeText={(text) => setLocation(text)}
//         placeholder="Location"
//       />
//       <Input
//         onChangeText={(text) => setExerciseName(text)}
//         placeholder="Exercise name"
//       />
//       <XStack gap="$5">
//         <Input
//           onChangeText={(text) => setReps(parseInt(text))}
//           placeholder="Reps: "
//         />
//         <Input
//           onChangeText={(text) => setWeight(parseInt(text))}
//           placeholder="Weight: "
//         />
//       </XStack>
//       <Input
//         inputMode="numeric"
//         onChangeText={(text) => setDuration(parseInt(text))}
//         placeholder="Duration"
//       />
//       <Button themeInverse onPress={postSession}>
//         Mickey Post
//       </Button>
//     </YStack>
//   );
// };

// export default Post;
