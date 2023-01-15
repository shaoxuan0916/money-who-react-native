import { View, Text, SafeAreaView, Image, ScrollView } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { useTailwind } from "tailwind-rn/dist"
import { useNavigation } from "@react-navigation/native"
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import useAuthStore from "../store/authStore"
import { auth } from "../config/firebase"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigator/RootNavigator"
import Button from "../components/Button"
import Input from "../components/Input"

export type LoginScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>

const LoginScreen = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth)

  const { addUser } = useAuthStore()

  const [errorMsg, setErrorMsg] = useState<string>("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const tw = useTailwind()
  const navigation = useNavigation<LoginScreenNavigationProp>()

  const handleLogin = async (e: any) => {
    e.preventDefault()

    if (email === "" || password === "") {
      setErrorMsg("Email or Password cannot be empty")
      return
    }

    await signInWithEmailAndPassword(email, password)

    return Promise.reject()
  }

  useEffect(() => {
    if (user) {
      addUser(user.user)
    }

    if (error) {
      console.log("error------", error)

      if (errorMsg.includes("network-request-failed")) {
        setErrorMsg("Network error. Please check your network.")
      } else {
        setErrorMsg("Invalid email or password")
      }
    }
  }, [user, error, loading])

  return (
    <ScrollView style={tw("bg-[#fff] h-[100%]")}>
      <View style={tw("px-8 pb-12 pt-32 bg-green4")}>
        <Image
          style={tw("w-auto h-20")}
          resizeMode="contain"
          source={require("../assets/images/logo-no-background.png")}
        />
      </View>

      <View style={tw("w-full px-8 pt-12")}>
        <Text style={tw("text-4xl font-semibold text-textColor mb-8")}>
          Log In
        </Text>

        {errorMsg && <Text style={tw("text-errorMsg")}>{errorMsg}</Text>}

        <Input label="Email" placeholder="Your Email" setValue={setEmail} />
        <Input
          type="password"
          label="Password"
          placeholder="Password"
          setValue={setPassword}
        />

        <View style={tw("mt-4 ")}>
          <Button
            onPress={handleLogin}
            text={loading ? "Logging in ..." : "Log In"}
          />

          <View style={tw("my-1")}>
            <Button
              linkType={true}
              onPress={() => navigation.navigate("Signup")}
              text="Doesn't Have An & Account? Sign Up Now"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default LoginScreen
