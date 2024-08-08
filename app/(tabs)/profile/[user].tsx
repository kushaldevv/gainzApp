import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import UserProfile from '@/components/profile/userProfile'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'

const Profile = () => {
  const { user } = useUser();
  const params = useLocalSearchParams();
  const userID = params.userIdParam as string;
  return (
   <UserProfile userID={userID || user?.id!} isPublicProfile={false}/>
  )
}

export default Profile