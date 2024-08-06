import { View, Text } from 'react-native'
import React from 'react'
import UserProfile from '@/components/profile/userProfile'
import { useUser } from '@clerk/clerk-expo'

const Profile = () => {
  const { user } = useUser()
  return (
   <UserProfile userID={user?.id!} isPublicProfile={false}/>
  )
}

export default Profile