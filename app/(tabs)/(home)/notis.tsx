import { useUser } from "@clerk/clerk-expo";
import React from "react";
import { View, Text, YStack, Button } from "tamagui";
import { getNotis } from "@/services/apiCalls";
import * as Types from "@/types";

const NotiScreen = () => {
  const { user } = useUser();
  const [notis, setNotis] = React.useState<Types.Noti[]>([]);
  const fetchNotis = async () => {
    try {
      const notisData = await getNotis(user?.id as string);
      setNotis(notisData);
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      <Button onPress={fetchNotis}>
        <Text>Fetch Notis</Text>
      </Button>
    </YStack>
  );
};

export default NotiScreen;
