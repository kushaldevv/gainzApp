import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

import * as WebBrowser from "expo-web-browser"
import { useWarmUpBrowser } from '@/app/hooks/useWarmUpBrowser';

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
import { TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession()

enum Strategy {
  Google = 'oauth_google',
}

export default function SignInScreen() {
  useWarmUpBrowser();
  const [loading, setLoading] = useState(false);
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' })

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

  const onSelectAuth = async (strategy: Strategy) => {

    const selectedAuth = {
      [Strategy.Google]: googleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  // async function onGoogleSignIn() {
  //   const [isLoading, setIsLoading] = useState(false)
  //   const googleOAuth = useOAuth({ strategy: "oauth_google" })

  //   try {
  //     const oAuthFlow = await googleOAuth.startOAuthFlow()

  //     if (oAuthFlow.authSessionResult?.type === "success") {
  //       if (oAuthFlow.setActive) {
  //         await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
  //       }
  //     } else {

  //     }

  //   } catch (error) {
  //     console.log(error)
  //     // setIsLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   WebBrowser.warmUpAsync()

  //   return () => {
  //     WebBrowser.coolDownAsync()
  //   }
  // }, [])

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
                <Button flex={1} minWidth="100%" onPress={() => onSelectAuth(Strategy.Google)}>
                  <Button.Icon>
                    <AntDesign name="google" size={24} />
                  </Button.Icon>
                  <Button.Text>Continue with Google</Button.Text>
                </Button>
                {/* <TouchableOpacity onPress={() => onSelectAuth(Strategy.Google)}>
                    <AntDesign name="google" size={24} />
                    <Button.Text>Continue with Google</Button.Text>
                </TouchableOpacity> */}
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
