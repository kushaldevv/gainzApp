import { View, Text } from 'react-native'
import React from 'react'
import UserProfile from '@/components/profile/userProfile'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'

const Profile = () => {
  const params = useLocalSearchParams();
  const { userIdParam, userFollowingParam } = params;
  return (
   <UserProfile userID={userIdParam as string} isPublicProfile={true} following={userFollowingParam as string === 'true'}/>
  )
}

export default Profile