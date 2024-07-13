import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Button } from "tamagui";
import { useClerk } from "@clerk/clerk-expo";
import { View, Text, YStack } from "tamagui";
export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <YStack
      flex={1}
      alignItems="center"
      backgroundColor={"$background"}
    >
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Button onPress={() => signOut()}>Log out</Button>
      </SignedIn>
      <SignedOut>
        {/* <SignInScreen/> */}
        <Link href="/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </SignedOut>
    </YStack>
  );
}
