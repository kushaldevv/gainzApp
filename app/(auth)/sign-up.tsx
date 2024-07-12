import * as React from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
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
  Progress,
} from "tamagui";
import { Mail, Key, Eye, EyeOff, User } from "@tamagui/lucide-icons";
import { FormCard } from "@/components/layoutParts";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { Alert } from "@/components/alertDialog";
import { useFocusEffect } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { useShakeAnimation } from "@/components/shakeAnimation";

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
  const shake = useShakeAnimation(error != "");
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
      console.error(JSON.stringify(err, null, 2));
      setError("Verification");
      setValues(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus();
    }
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
    <Animated.View style={[{ flex: 1 }, shake]}>
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
                    <Label>Email</Label>
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
                    {error.includes("Password") && emailError && (
                      <Paragraph size={"$2"} pt={"$2"} col={"$red10"}>
                        {"Enter valid password."}
                      </Paragraph>
                    )}
                  </View>
                  <Progress size={"$1"} value={progress}>
                    <Progress.Indicator
                      animation="bouncy"
                      backgroundColor={
                        progress < 30
                          ? "$red10"
                          : progress < 60
                          ? "$orange10"
                          : progress < 80
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
                      <Button flex={1} minWidth="100%">
                        <Button.Icon>
                          <AntDesign name="google" size={24} />
                        </Button.Icon>
                        <Button.Text>Continue with Google</Button.Text>
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
                <Text alignSelf="center" 
                scale={pressedInResendCode ? 1.15 : 1.0}
                fontWeight={pressedInResendCode ? 'bold' : '$1'}
                animation={'quick'}
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

                <Button onPress={onPressVerify}>Verify</Button>

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
          </View>
        </FormCard>
      </YStack>
    </Animated.View>
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
