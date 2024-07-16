import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import {
  Button,
  H1,
  Input,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  View, XStack,
  Label
} from "tamagui";
import { Mail, Key, Eye, EyeOff } from "@tamagui/lucide-icons";
import { FormCard } from "@/components/layoutParts";
import { useShakeAnimation } from "@/components/shakeAnimation";
import Animated from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const shake = useShakeAnimation(error);
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  // sign in with apple
  const onApplePress = useCallback(async () => {
    if (!setActive) {
      console.log("setActive is not available");
      return;
    }

    try {
      const { createdSessionId } = await startAppleOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log("sign in with apple failed :(");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  // sign in with google
  const onGooglePress = useCallback(async () => {
    if (!setActive) {
      console.log("setActive is not available");
      return;
    }

    try {
      const { createdSessionId } = await startGoogleOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log("sign in with apple failed :(");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const onSignInPress = useCallback(async () => {
    setError(false);
    setLoading(true);
    if (!isLoaded) {
      setLoading(false);
      return;
    }
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        await new Promise((resolve) => setTimeout(resolve, 250));
        setError(true);
      }
    } catch (err: any) {
      console.log(err.errors[0].longMessage);
      await new Promise((resolve) => setTimeout(resolve, 250));
      setError(true);
    }
    setLoading(false);
  }, [isLoaded, emailAddress, password]);

  useFocusEffect(
    useCallback(() => {
      return async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setEmailAddress("");
        setPassword("");
        setShowPassword(false);
        setError(false);
      };
    }, [])
  );
  return (
    <Animated.View style={[{ flex: 1 }, shake]}>
      <FormCard error = {error}>
        <H1
          alignSelf="center"
          size="$8"
          $xs={{
            size: "$7",
          }}
        >
          Sign in to your account
        </H1>
        <View flexDirection="column" gap="$3">
          <View flexDirection="column">
            <Label>Email</Label>
            <XStack>
              <Input
                flex={1}
                pl="$7"
                textContentType="emailAddress"
                placeholder="email@example.com"
                borderColor={error ? "$red10" : "$borderColor"}
                focusStyle={{
                  borderColor: error ? "$red10" : "$borderColor",
                }}
                onChangeText={(text) => setEmailAddress(text)}
              />
              <Mail size={"$1"} alignSelf="center" pos={"absolute"} ml="$3" />
            </XStack>
            <View
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Label>Password</Label>
              <ForgotPasswordLink />
            </View>
            <XStack>
              <Input
                flex={1}
                pl="$7"
                pr="$7"
                borderColor={error ? "$red10" : "$borderColor"}
                focusStyle={{
                  borderColor: error ? "$red10" : "$borderColorFocus",
                }}
                textContentType="password"
                secureTextEntry={!showPassword}
                placeholder="Enter password"
                onChangeText={(text) => setPassword(text)}
              />
              <Key size={"$1"} alignSelf="center" pos={"absolute"} ml="$3" />
              {!showPassword && (
                <Eye
                  size={"$1"}
                  alignSelf="center"
                  right="$0"
                  pos={"absolute"}
                  mr="$3"
                  onPress={() => setShowPassword(true)}
                />
              )}
              {showPassword && (
                <EyeOff
                  size={"$1"}
                  alignSelf="center"
                  right="$0"
                  pos={"absolute"}
                  mr="$3"
                  onPress={() => setShowPassword(false)}
                />
              )}
            </XStack>
          </View>
          <View flexDirection="column" gap="$1"></View>
        </View>
        <Button
          themeInverse
          disabled={!isLoaded}
          onPress={onSignInPress}
          width="100%"
        >
          <Button.Text>Sign In</Button.Text>
          {loading && <Spinner size="small" color="$accentColor" />}
        </Button>
        <View flexDirection="column" gap="$3" width="100%" alignItems="center">
          <View
            flexDirection="column"
            gap="$3"
            width="100%"
            alignSelf="center"
            alignItems="center"
          >
            <View flexDirection="row" width="100%" alignItems="center" gap="$4">
              <Separator />
              <Paragraph>Or</Paragraph>
              <Separator />
            </View>
            <View flexDirection="row" flexWrap="wrap" gap="$3">
              <Button flex={1} minWidth="100%" onPress={onGooglePress}>
                <Button.Icon>
                  <AntDesign name="google" size={24} />
                </Button.Icon>
                <Button.Text>Continue with Google</Button.Text>
              </Button>
              <Button flex={1} minWidth="100%" onPress={onApplePress}>
                <Button.Icon>
                  <AntDesign name="apple1" size={24} />
                </Button.Icon>
                <Button.Text>Continue with Apple</Button.Text>
              </Button>
            </View>
          </View>
          <SignUpLink />
        </View>
      </FormCard>
    </Animated.View>
  );
}

const SignUpLink = () => {
  return (
    <Paragraph textDecorationStyle="unset">
      Don&apos;t have an account?{" "}
      <Link href={"/sign-up"}>
        <SizableText
          hoverStyle={{
            color: "$colorHover",
          }}
          textDecorationLine="underline"
        >
          Sign Up
        </SizableText>
      </Link>
    </Paragraph>
  );
};

const ForgotPasswordLink = () => {
  return (
    <Link href={"/forgot-password"}>
      <Paragraph
        hoverStyle={{
          color: "$colorHover",
        }}
        cursor="pointer"
        size="$1"
        marginTop="$1"
      >
        Forgot your password?
      </Paragraph>
    </Link>
  );
};
