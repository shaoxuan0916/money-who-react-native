import { View, Text, Image, SafeAreaView, TouchableOpacity } from "react-native"
import React, { useLayoutEffect } from "react"
import { useTailwind } from "tailwind-rn/dist"
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigator/RootNavigator"
import Button from "../components/Button"

export type WelcomeScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>

const WelcomeScreen = () => {
  const tw = useTailwind()
  const navigation = useNavigation<WelcomeScreenNavigationProp>()

  return (
    <View style={tw("bg-green4 h-[100%] pt-28 px-8")}>
      <Image
        style={tw("w-auto h-20 py-16")}
        resizeMode="contain"
        source={require("../assets/images/logo-no-background.png")}
      />

      <View style={tw("text-textColor py-12")}>
        <Text style={tw("text-xl text-left")}>
          Easiest way to share expenses with friends and family and stop
          stressing about
          <Text style={{ fontStyle: "italic" }}> "who owes who" </Text>
        </Text>
      </View>

      <View style={tw("my-4")}>
        <Button onPress={() => navigation.navigate("Signup")} text="Sign Up" />
      </View>

      <View style={tw("")}>
        <Button
          onPress={() => navigation.navigate("Login")}
          text="Log In"
          outline={true}
        />
      </View>
    </View>
  )
}

export default WelcomeScreen
