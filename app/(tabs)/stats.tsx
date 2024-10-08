import { View, Text } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo';
import StatsView from '@/components/stats/statsView';
const Stats = () => {
  const {user} = useUser();
  return (
    <StatsView userID={user?.id as string} />
  )
}

export default Stats