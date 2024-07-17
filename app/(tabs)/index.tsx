import { Card } from "@/components/card";
import * as Types from "@/types";
import React, { useEffect, useState } from "react";
import { ScrollView, View, YStack } from "tamagui";
import { getUser, getUsers } from '../../services/apiCalls';
// For testing purposes -----------------------//

// home page
// const user: Types.User = {
//   id: "1",
//   name: "Leul Mesfin",
//   pfp: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
// };

// const exerciseSet1: Types.ExerciseSet = {
//   reps: 6,
//   weight: 135,
// };

// const exerciseSet2: Types.ExerciseSet = {
//   reps: 8,
//   weight: 205,
// };

// const exerciseSet3: Types.ExerciseSet = {
//   reps: 8,
//   weight: 215,
// };

// const exercise: Types.Exercise = {
//   name: "Back Squat",
//   sets: [exerciseSet1, exerciseSet2, exerciseSet3],
// };

// const session: Types.Session = {
//   id: "1",
//   user: user,
//   location: "Golds Gym - Frederick, MD",
//   date: new Date(),
//   exercises: [exercise, exercise, exercise],
//   sessionTime: 6022,
//   comments: ["Great job!", "Keep it up!", "You got this!"],
//   likes: [
//     "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
//     "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
//     "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
//     "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
//   ],
// };
// ------------------------------------------------- //

const fetchUsers = async() => {
  try {
    return await getUsers();
  } catch (error) {
    throw error;
  }
}


const fetchUser = async(id: string) => {
  try {
    return await getUser(id);
  } catch (error) {
    throw error;
  }
}

const Page = () => {
  const [users, setUsers] = useState<{ user: Types.User; session: Types.Session }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUsers();
        console.log("datum: ", data.usersTable[0].sessions);
        console.log("\n\n\n\n\n\n\n")
        // const data2 = await fetchUser("user_2j85qqMXiHzR7YzttZCtqSpkPYh");
        // console.log("data2: ", data2);
        // console.log("\n\n\n\n");

        const processUsers = data.usersTable.map((userData: { ID: string; name: string; sessions: { sessionID: string; location: string; date: string}; }) => {
          const user: Types.User = {
            id: userData.ID,
            name: userData.name,
            pfp: require('../../assets/images/doMan.jpeg'),//"https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",,
          };

          const session: Types.Session = {
            id: userData.sessions.sessionID,
            user: user,
            location: userData.sessions.location,
            date: userData.sessions.date,
            exercises: [],
            sessionTime: 6022,
            comments: [],
            likes: [],
          };

          return {user, session};
        });
        // const userId = data.usersTable[0].userID;
        // const name = data.usersTable[0].userName;
        // const sessionId = data.usersTable[0].sessions.sessionID;
        // const sessionLoc = data.usersTable[0].sessions.location;
        setUsers(processUsers);

        // console.log("data: ", data.usersTable);
        // console.log("\n\n\n\n")
        // // console.log("user id: ", userId);
        // // console.log("name: ", name);

        // // keeping all nested arrays empty for now...
        // user.id = userId;
        // user.name = name;
        // session.id = sessionId;
        // session.user = user;
        // session.location = sessionLoc;
        // session.exercises = [];
        // session.comments = [];
        // session.likes = [];

        
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    };

    loadData();
  }, []);
  
  return (
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"}>
        <View gap="$2">
          {users.map(({user, session}, index) => (
            <Card key={index} session={session} />
          ))}
          {/* <Card session={session} /> */}
          {/* <Card session={session} />
          <Card session={session} /> */}
        </View>
      </ScrollView>
    </YStack>
  );
}

export default Page;