import { AlertDialog, Button, Label, Paragraph, XStack, YStack } from "tamagui";
export function Alert() {
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        <Label textDecorationLine="underline" fontFamily={'$mono'}>Password</Label>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack gap="$3">
            <AlertDialog.Title>Password Requirements</AlertDialog.Title>

            <AlertDialog.Description>
              <Paragraph>
                {`At least: 1 digit,\n1 uppercase letter,\n1 lowercase letter,\n1 special character,\n8 characters long`}
              </Paragraph>
            </AlertDialog.Description>
            <XStack gap="$3" justifyContent="flex-end">
              {/* <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel> */}
              <AlertDialog.Action asChild>
                <Button theme="active">Close</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
