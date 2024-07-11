import * as React from "react";
import { useSignUp, useAuth, useOAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
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
  XStack,
  Text,
} from "tamagui";
import { FormCard } from "@/components/layoutParts";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [firstName, setFirstName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(Input | null)[]>([]);
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  // sign in with apple
  const onApplePress = useCallback(async () => {
    if (!setActive) {
      console.log("setActive is not available");
      return;
    }
    
    try {
      const { createdSessionId} = await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        console.log("sign in with apple failed :(");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const onSignUpPress = async () => {
    setLoading(true);
    if (!isLoaded) {
      setLoading(false);
      return;
    }

    try {
      await signUp.create({
        firstName: firstName,
        emailAddress: emailAddress,
        password: password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
    setLoading(false);
  };

  
  const handleChange = (text: string, index: number) => {
    const newValues = [...values];
    newValues[index] = text.replace(/[^0-9]/g, "").slice(0, 1);
    setValues(newValues);
    setCode(newValues.toString().replaceAll(",", ""));

    if (text) {
      // Move to next input if there's text and it's not the last input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Move to previous input if the current input is empty and it's not the first input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
          {!pendingVerification && (
            <>
              <H1
                alignSelf="center"
                size="$8"
                $xs={{
                  size: "$7",
                }}
              >
                Create an Account
              </H1>
              <View flexDirection="column" gap="$3">
                <View flexDirection="column">
                  <Label>Name</Label>
                  <Input
                    textContentType="name"
                    placeholder="Name"
                    borderWidth={1}
                    onChangeText={(text) => setFirstName(text)}
                  ></Input>
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
                onPress={onSignUpPress}
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
                <Button.Text>Sign Up</Button.Text>
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
                    <Button flex={1} minWidth="100%">
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
                <SignInLink />
              </View>
            </>
          )}
          {pendingVerification && (
            <>
              <H1
                alignSelf="center"
                size="$8"
                $xs={{
                  size: "$7",
                }}
              >
                Enter your Verification code
              </H1>
              <Text alignSelf="center">
                We sent a verification code to your email!
              </Text>
              <XStack gap="$3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    minWidth={"$4.5"}
                    ref={(ref) => inputRefs.current.push(ref)}
                    key={index}
                    value={values[index]}
                    onChangeText={(text) => handleChange(text, index)}
                    maxLength={1}
                    keyboardType="numeric"
                  />
                ))}
              </XStack>

              <Button onPress={onPressVerify}>Verify</Button>

              <Paragraph textDecorationStyle="unset" textAlign="center">
                Didn't receive code?{" "}
                <SizableText
                  hoverStyle={{
                    color: "$colorHover",
                  }}
                  textDecorationLine="underline"
                  cursor="pointer"
                >
                  Resend code
                </SizableText>
              </Paragraph>
            </>
          )}
        </View>
      </FormCard>
    </YStack>
  );
}

const SignInLink = () => {
  return (
    <Link href={"/sign-in"}>
      <Paragraph textDecorationStyle="unset">
        Already have an account?{" "}
        <SizableText
          hoverStyle={{
            color: "$colorHover",
          }}
          textDecorationLine="underline"
        >
          Sign In
        </SizableText>
      </Paragraph>
    </Link>
  );
};
