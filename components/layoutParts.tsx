import { View, styled } from "tamagui";
export const FormCard = styled(View, {
  tag: "form",
  flexDirection: "row",
  maxWidth: "100%",
  borderRadius: 30,

  '$gtSm' : {
    borderWidth: 1,
    shadowColor: '$shadowColor',
    shadowRadius: 12,
  },
  borderColor: '$borderColor',
  // '$gtSm': {
  // padding: "$6",
  // },
  $xs: {
    minWidth: "70%",
  },
  $sm: {
    minWidth: "60%",
  },
});