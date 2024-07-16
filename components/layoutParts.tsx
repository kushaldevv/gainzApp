import { View, styled, YStack } from "tamagui";
import * as Types from "@/types";
import Animated from "react-native-reanimated";
import { useShakeAnimation } from "@/components/shakeAnimation";

const Middle = styled(View, {
  tag: "form",
  flexDirection: "row",
  maxWidth: "100%",
  borderRadius: 30,

  $gtSm: {
    borderWidth: 1,
    shadowColor: "$shadowColor",
    shadowRadius: 12,
  },
  borderColor: "$borderColor",
  $xs: {
    minWidth: "70%",
  },
  $sm: {
    minWidth: "60%",
  },
});

export const FormCard = ({ children, error }: Types.FormCardProps) => {
  const shake = useShakeAnimation(error);

  return (
    <Animated.View style={[{ flex: 1, width: "100%" }, shake]}>
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={"$background"}
      >
        <Middle>
          <View
            flexDirection="column"
            alignItems="stretch"
            justifyContent="center"
            minWidth="100%"
            maxWidth="100%"
            gap="$4"
            padding="$4"
            paddingVertical="$6"
            $gtSm={{
              paddingVertical: "$4",
              width: 400,
            }}
          >
            {children}
          </View>
        </Middle>
      </YStack>
    </Animated.View>
  );
};
