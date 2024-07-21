import React from 'react';
import { Button, ScrollView, XStack, YStack } from 'tamagui';

const Likes = () => {  
  return (
    // <View style={{ flex: 1 }}>
    //   <XStack justifyContent="space-between" alignItems="center" padding="$4">
    //     <Button onPress={() => router.back()}>Back</Button>
    //     <Text>Likes</Text>
    //   </XStack>
      
    //   {/* Rest of your Likes screen content */}
    //   <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //     <Text>This is the Likes Screen</Text>
    //     {/* You can add your likes content here */}
    //   </View>
    // </View>
    <YStack flex={1} alignItems="center" backgroundColor={"$background"}>
      <ScrollView width={"100%"} backgroundColor='red'>
        
      </ScrollView>
    </YStack>
  );
};

export default Likes;