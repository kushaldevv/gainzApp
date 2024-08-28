import { AlertDialog, Button, Label, Paragraph, XStack, YStack } from "tamagui";

interface AlertProps {
	isOpen: boolean;
	handleResume: () => void;
	handleFinish: () => void;
}

const PauseFinishAlert = ({
	isOpen,
	handleResume,
	handleFinish,
    
}: AlertProps) => {
	return (
        <AlertDialog native>
        <AlertDialog.Trigger asChild>
          <Button>test</Button>
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
              <AlertDialog.Title>Workout Paused</AlertDialog.Title>
  
              <AlertDialog.Description>
                <Paragraph textAlign="center">
                  {`Resume to continue your workout.\nFinish to end your workout.`}
                </Paragraph>
              </AlertDialog.Description>
              <XStack gap="$3" justifyContent="flex-end">
                {/* <AlertDialog.Cancel asChild>
                  <Button>Cancel</Button>
                </AlertDialog.Cancel> */}
                <AlertDialog.Action asChild>
                  <Button theme="active">Resume</Button>
                </AlertDialog.Action>
                <AlertDialog.Action asChild>
                  <Button theme="active">Finish</Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
	);
};
export default PauseFinishAlert;