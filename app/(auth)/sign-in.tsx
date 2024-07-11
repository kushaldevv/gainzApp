import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth, useOAuth } from "@clerk/clerk-expo";
import {
  AnimatePresence,
  Button,
  H1,
  Input,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  View,
  YStack,
  Label,
} from "tamagui";
import { FormCard } from "@/components/layoutParts";

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

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

  const onSignInPress = React.useCallback(async () => {
    setLoading(true);
    console.log(setLoading);
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
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
    setLoading(false);
  }, [isLoaded, emailAddress, password]);

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor={"$background"}
    >
      <FormCard>
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
              <Input
                textContentType="emailAddress"
                placeholder="email@example.com"
                borderWidth={1}
                onChangeText={(text) => setEmailAddress(text)}
              ></Input>
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Label>Password</Label>
                <ForgotPasswordLink />
              </View>
              <Input
                borderWidth={1}
                textContentType="password"
                secureTextEntry
                id="password"
                placeholder="Enter password"
                onChangeText={(text) => setPassword(text)}
              ></Input>
            </View>
            <View flexDirection="column" gap="$1"></View>
          </View>
          <Button
            themeInverse
            disabled={!isLoaded}
            onPress={onSignInPress}
            width="100%"
            iconAfter={
              <AnimatePresence>
                {loading && (
                  <Spinner
                    key="loading-spinner"
                    opacity={1}
                    scale={1}
                    position="absolute"
                    left="60%"
                    enterStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                    exitStyle={{
                      opacity: 0,
                      scale: 0.5,
                    }}
                  />
                )}
              </AnimatePresence>
            }
          >
            <Button.Text>Sign In</Button.Text>
          </Button>
          <View
            flexDirection="column"
            gap="$3"
            width="100%"
            alignItems="center"
          >
            <View
              flexDirection="column"
              gap="$3"
              width="100%"
              alignSelf="center"
              alignItems="center"
            >
              <View
                flexDirection="row"
                width="100%"
                alignItems="center"
                gap="$4"
              >
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
        </View>
      </FormCard>
    </YStack>
  );
}

const SignUpLink = () => {
  return (
    <Link href={"/sign-up"}>
      <Paragraph textDecorationStyle="unset">
        Don&apos;t have an account?{" "}
        <SizableText
          hoverStyle={{
            color: "$colorHover",
          }}
          textDecorationLine="underline"
        >
          Sign Up
        </SizableText>
      </Paragraph>
    </Link>
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