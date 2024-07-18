import { Alert } from "@/components/alertDialog";
import { FormCard } from "@/components/layoutParts";
import { useShakeAnimation } from "@/components/shakeAnimation";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Eye, EyeOff, Key, Mail, User } from "@tamagui/lucide-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { useCallback, useRef, useState } from "react";
import Animated from "react-native-reanimated";
import {
  Button,
  H1,
  Input,
  Label,
  Paragraph,
  Progress,
  Separator,
  SizableText,
  Spinner,
  Text,
  View,
  XStack,
} from "tamagui";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0);

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(Input | null)[]>([]);
  const shakeName = useShakeAnimation(error.includes("Name"));
  const shakeEmail = useShakeAnimation(error.includes("Email"));
  const shakePassword = useShakeAnimation(error.includes("Password"));
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: "oauth_apple", });
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: "oauth_google", });

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

  // sign in with Google
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

  const [pressedInResendCode, setPressedInResendCode] = useState(false);

  function updatePasswordProgess(password: string) {
    let newProgress = 0;
    // 5 points for each character capped at 40
    newProgress += Math.min(password.length * 5, 40);
    // 15 points each for other requirements, awarded only once
    if (/[A-Z]/.test(password)) newProgress += 15; // Uppercase
    if (/[a-z]/.test(password)) newProgress += 15; // Lowercase
    if (/[0-9]/.test(password)) newProgress += 15; // Digit
    if (/[^A-Za-z0-9]/.test(password)) newProgress += 15; // Special character

    setProgress(Math.min(newProgress, 100));
  }

  async function onSignUpPress() {
    setError("");
    setLoading(true);
    let currErrors = "";

    if (firstName.trim() == "") {
      currErrors += "Name";
    }
    if (
      emailAddress.trim() == "" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)
    ) {
      currErrors += "Email";
    }
    if (progress != 100) {
      currErrors += "Password";
    }
    if (currErrors) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setError(currErrors);
      setLoading(false);
      return;
    }
    onSignUpPressClerk();
  }

  const onSignUpPressClerk = async () => {
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
      const errorLongMessage = err.errors[0].longMessage;
      console.log(errorLongMessage);
      if (
        errorLongMessage == "That email address is taken. Please try another."
      ) {
        setEmailError("That email address is taken. Please try another.");
      }
    }
    setLoading(false);
  };

  const handleChange = (text: string, index: number) => {
    const newValues = [...values];
    newValues[index] = text.replace(/[^0-9]/g, "").slice(0, 1);
    setValues(newValues);
    setCode(newValues.join(""));
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onPressVerify = async () => {
    setError("");
    setLoading(true);
    if (!isLoaded) {
      setLoading(false);
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
      console.error(JSON.stringify(err, null, 2));
      setError("Verification");
      setValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      return async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setFirstName("");
        setEmailAddress("");
        setPassword("");
        setShowPassword(false);
        setEmailError("");
        setProgress(0);
        setError("");
      };
    }, [])
  );

  return (
    <FormCard error={error.length > 0}>
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
              <Animated.View style={[shakeName]}>
                <XStack>
                  <Input
                    flex={1}
                    pl="$7"
                    borderColor={
                      error.includes("Name") ? "$red10" : "$borderColor"
                    }
                    focusStyle={{
                      borderColor: error.includes("Name")
                        ? "$red10"
                        : "$borderColor",
                    }}
                    textContentType="name"
                    placeholder="Name"
                    borderWidth={1}
                    onChangeText={(text) => setFirstName(text)}
                  />
                  <User
                    size={"$1"}
                    alignSelf="center"
                    pos={"absolute"}
                    ml="$3"
                  />
                </XStack>
              </Animated.View>
              <Label>Email</Label>
              <Animated.View style={[shakeEmail]}>
                <XStack>
                  <Input
                    flex={1}
                    pl="$7"
                    textContentType="emailAddress"
                    placeholder="email@example.com"
                    borderColor={
                      emailError || error.includes("Email")
                        ? "$red10"
                        : "$borderColor"
                    }
                    focusStyle={{
                      borderColor:
                        emailError || error.includes("Email")
                          ? "$red10"
                          : "$borderColor",
                    }}
                    onChangeText={(text) => setEmailAddress(text)}
                  />
                  <Mail
                    size={"$1"}
                    alignSelf="center"
                    pos={"absolute"}
                    ml="$3"
                  />
                </XStack>
              </Animated.View>
              {emailError && (
                <Paragraph size={"$2"} pt={"$2"} col={"$red10"}>
                  {emailError}
                </Paragraph>
              )}
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Alert />
              </View>
              <Animated.View style={[shakePassword]}>
                <XStack>
                  <Input
                    flex={1}
                    pl="$7"
                    pr="$7"
                    borderColor={
                      error.includes("Password") ? "$red10" : "$borderColor"
                    }
                    focusStyle={{
                      borderColor: error.includes("Password")
                        ? "$red10"
                        : "$borderColor",
                    }}
                    textContentType="password"
                    secureTextEntry={!showPassword}
                    id="password"
                    placeholder="Enter password"
                    onChangeText={(text) => {
                      setPassword(text);
                      updatePasswordProgess(text);
                    }}
                  />
                  <Key
                    size={"$1"}
                    alignSelf="center"
                    pos={"absolute"}
                    ml="$3"
                  />
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
              </Animated.View>
            </View>
            <Progress size={"$1"} value={progress}>
              <Progress.Indicator
                animation="bouncy"
                backgroundColor={
                  progress < 30
                    ? "$red10"
                    : progress < 60
                    ? "$orange10"
                    : progress <= 99
                    ? "$yellow10"
                    : "$green10"
                }
              />
            </Progress>
            <View flexDirection="column" gap="$1"></View>
          </View>
          <Button
            themeInverse
            disabled={!isLoaded}
            onPress={onSignUpPress}
            width="100%"
          >
            <Button.Text>Sign Up</Button.Text>
            {loading && <Spinner size="small" color="$accentColor" />}
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
          <Text
            alignSelf="center"
            scale={pressedInResendCode ? 1.15 : 1.0}
            fontWeight={pressedInResendCode ? "bold" : "$1"}
            animation={"quick"}
          >
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
                onKeyPress={(e) => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="numeric"
                borderColor={
                  error.includes("Verification") ? "$red10" : "$borderColor"
                }
                focusStyle={{
                  borderColor: error.includes("Verification")
                    ? "$red10"
                    : "$borderColor",
                }}
              />
            ))}
          </XStack>

          <Button onPress={onPressVerify}>
            <Button.Text>Verify</Button.Text>
            {loading && <Spinner size="small" color="$white" />}
          </Button>

          <Paragraph textDecorationStyle="unset" textAlign="center">
            {"Didn't receive code? "}
            <SizableText
              alignSelf="center"
              color={pressedInResendCode ? "$colorHover" : "$color"}
              hoverStyle={{
                color: "$colorHover",
              }}
              textDecorationLine="underline"
              cursor="pointer"
              onPress={() => {
                setError("");
                onSignUpPressClerk();
              }}
              onPressIn={() => setPressedInResendCode(true)}
              onPressOut={() => setPressedInResendCode(false)}
            >
              Resend code
            </SizableText>
          </Paragraph>
        </>
      )}
    </FormCard>
  );
}

const SignInLink = () => {
  return (
    <Paragraph textDecorationStyle="unset">
      Already have an account?{" "}
      <Link href={"/sign-in"}>
        <SizableText
          hoverStyle={{
            color: "$colorHover",
          }}
          textDecorationLine="underline"
        >
          Sign In
        </SizableText>
      </Link>
    </Paragraph>
  );
};
