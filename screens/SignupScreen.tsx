import { View, Text, SafeAreaView, Image, ScrollView } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import Button from "../components/Button"
import { useTailwind } from "tailwind-rn/dist"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigator/RootNavigator"
import Input from "../components/Input"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"
import useAuthStore from "../store/authStore"
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"

export type SignupScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>

const SignupScreen = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth)

  const { addUser } = useAuthStore()

  const [errorMsg, setErrorMsg] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Todo:
  // const [username, setUsername] = useState("");

  const handleSignUp = (e: any) => {
    e.preventDefault()

    if (email === "" || password === "") {
      setErrorMsg("Email or Password cannot be empty")
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Password and confirm password doen't match")
      return
    }

    if (password.length < 8) {
      setErrorMsg("Password should at least 8 characters")
      return
    }

    createUserWithEmailAndPassword(email, password)
  }

  useEffect(() => {
    if (user) {
      // Signed in
      if (errorMsg) {
        setErrorMsg("")
      }

      // add new user to firestore
      try {
        setDoc(
          doc(db, "users", user.user.uid),
          {
            email: email,
            uid: user.user.uid,
          },
          { merge: true }
        )
        addUser(user.user)
      } catch (e) {
        console.error("Error adding document: ", e)
      }
    }

    if (error) {
      const errorMsg = error.message

      console.log("error", error)
      console.log("errorToString", errorMsg)

      if (errorMsg.includes("email-already-in-use")) {
        setErrorMsg("User Alreay Exist")
      } else if (errorMsg.includes("invalid-email")) {
        setErrorMsg("Invalid Email")
      } else if (errorMsg.includes("network-request-failed")) {
        setErrorMsg("Network error. Please check your network.")
      } else {
        setErrorMsg("Something Went Wrong. Please Try Again.")
      }
    }
  }, [user, error])

  const tw = useTailwind()
  const navigation = useNavigation<SignupScreenNavigationProp>()

  return (
    <ScrollView style={tw("bg-[#fff] h-[100%]")}>
      <View style={tw("bg-green4 px-8 pb-12 pt-32")}>
        <Image
          style={tw("w-auto h-20")}
          resizeMode="contain"
          source={require("../assets/images/logo-no-background.png")}
        />
      </View>

      <View style={tw("w-full px-8 pt-12")}>
        <Text style={tw("text-4xl font-semibold text-textColor mb-8")}>
          Sign Up
        </Text>

        {errorMsg && <Text style={tw("text-errorMsg")}>{errorMsg}</Text>}

        <Input label="Email" placeholder="Your Email" setValue={setEmail} />
        <Input
          type="password"
          label="Password"
          placeholder="Minimum 8 charaters"
          setValue={setPassword}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-type your password"
          setValue={setConfirmPassword}
        />

        <View style={tw("mt-4 ")}>
          <Button
            onPress={handleSignUp}
            text={loading ? "Signing Up ..." : "Sign Up"}
          />

          <View style={tw("my-1")}>
            <Button
              linkType={true}
              onPress={() => navigation.navigate("Login")}
              text="Already Have An Account? Login Now"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default SignupScreen
