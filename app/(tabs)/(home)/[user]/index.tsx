import { View, Text } from 'react-native'
import React from 'react'
import UserProfile from '@/components/profile/userProfile'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'

const Profile = () => {
  const params = useLocalSearchParams();
  const { userIdParam } = params;
  return (
   <UserProfile userID={userIdParam as string} isPublicProfile={true}/>
  )
}

export default Profile