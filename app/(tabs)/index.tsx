import Card from "@/components/card";
import { getUser, getUsers } from "@/services/apiCalls";
import * as Types from "@/types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef, useEffect, useState } from "react";
import { ScrollView, View, YStack } from "tamagui";

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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
            <Card key={index} session={session} bottomSheetModalRef={bottomSheetModalRef} />
          ))}
        </View>
      </ScrollView>
    </YStack>
  );
}

export default Page;