import { View, Text, RefreshControl, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Spinner, YStack } from "tamagui";
import Card from "@/components/home/card";
import * as Types from "@/types";
import { getSpecificUserSession, getUser } from "@/services/apiCalls";
import { useUser } from "@clerk/clerk-expo";

const skeletonSession: Types.Session = {
  id: " ",
  name: " ",
  user: {
    id: " ",
    name: " ",
    pfp: " ",
  },
  location: " ",
  date: " ",
  exercises: [],
  duration: 0,
  comments: 0,
  likes: [],
  numLikes: 0,
  userLiked: false,
};

// const SessionView = () => {
//   const sessionId = useLocalSearchParams().sessionIdParam as string;
//   const { user } = useUser();
//   const [session, setSession] = useState<Types.Session>(skeletonSession);
//   const [userDetails, setUserDetails] = useState<Types.User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [initialLoad, setInitialLoad] = useState(true);

//   useEffect(() => {
//     fetchSession();
//     fetchUserDetails();
//   }, []);

//   const fetchUserDetails = async () => {
//     if (user) {
//       const userDetails = await getUser(user.id);
//       setUserDetails(userDetails);
//     }
//   };
//   const fetchSession = async () => {
//     setLoading(true);
//     try {
//       const sessionData = await getSpecificUserSession(sessionId, user?.id as string);
//       setSession(sessionData);
//     } catch (error) {
//       console.error("Error fetching session:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       console.log("refreshing");
//       await fetchSession();
//     } catch (error) {
//       console.error("Error refreshing sessions:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };
//   return (
//     <YStack
//       flex={1}
//       alignItems="center"
//       backgroundColor={"$background"}
//     >
//       <ScrollView
//        width={"100%"}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//           />
//         }
//       >
//        {initialLoad && <Spinner/>}
//         {!loading && (
//           <Card
//             session={session}
//             userDetails={userDetails}
//             loading={loading}
//           />
//         )}
//       </ScrollView>
//     </YStack>
//   );
// };

// export default SessionView;

const SessionView = () => {
  const sessionId = useLocalSearchParams().sessionIdParam as string;
  const { user } = useUser();
  const [session, setSession] = useState<Types.Session>(skeletonSession);
  const [userDetails, setUserDetails] = useState<Types.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      await Promise.all([fetchSession(), fetchUserDetails()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    if (user) {
      const userDetails = await getUser(user.id);
      setUserDetails(userDetails);
    }
  };

  const fetchSession = async () => {
    try {
      const sessionData = await getSpecificUserSession(sessionId, user?.id as string);
      setSession(sessionData);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData(true);
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <YStack
      flex={1}
      backgroundColor={"$background"}
    >
      {isLoading ? (
        <Spinner mt = '$3'/>
      ) : (
        <ScrollView
          width={"100%"}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Card
            session={session}
            userDetails={userDetails}
            loading={isLoading}
          />
        </ScrollView>
      )}
    </YStack>
  );
};

export default SessionView;