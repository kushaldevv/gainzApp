import { AlertDialog, Button, XStack, YStack } from "tamagui";

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
		<AlertDialog open={isOpen}>
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
					<YStack space>
						<AlertDialog.Title>Workout Paused</AlertDialog.Title>

						<AlertDialog.Description fontFamily={"$mono"}>
							Press resume to continue your workout
						</AlertDialog.Description>
						<XStack gap="$3" justifyContent="flex-end">
							<AlertDialog.Cancel asChild>
								<Button onPress={handleResume} fontFamily={"$mono"}>Resume</Button>
							</AlertDialog.Cancel>

							<AlertDialog.Action asChild>
								<Button theme="active" onPress={handleFinish} fontFamily={"$mono"}>
									Finish
								</Button>
							</AlertDialog.Action>
						</XStack>
					</YStack>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog>
	);
};
export default PauseFinishAlert;