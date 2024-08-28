import { View, Text } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo';
import StatsView from '@/components/stats/statsView';
import { useLocalSearchParams } from 'expo-router';
const Stats = () => {
  const params = useLocalSearchParams();
  const { userID} = params;
  return (
    <StatsView userID={userID as string} />
  )
}

export default Stats