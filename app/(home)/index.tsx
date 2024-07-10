import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "tamagui";
import { useClerk } from "@clerk/clerk-expo";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (  
    <View>
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
    </View>
  );
}