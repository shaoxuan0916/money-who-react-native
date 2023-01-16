import { View, Text, SafeAreaView } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import FocusedStatusBar from "../components/FocusedStatusBar"
import { useTailwind } from "tailwind-rn/dist"
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { TabStackParamList } from "../navigator/TabNavigator"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigator/RootNavigator"
import useAuthStore from "../store/authStore"
import Input from "../components/Input"

import { useSignOut } from "react-firebase-hooks/auth"
import { auth } from "../config/firebase"
import Button from "../components/Button"

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Profile">,
  NativeStackNavigationProp<RootStackParamList>
>

const ProfileScreen = () => {
  const { userProfile, removeUser } = useAuthStore()
  const [signOut, loading, error] = useSignOut(auth)
  const tw = useTailwind()
  const navigation = useNavigation<HomeScreenNavigationProp>()

  const [userInfo, setUserInfo] = useState<any>()
  const [username, setUsername] = useState<any>()
  const [email, setEmail] = useState<any>()

  const handleLogout = async () => {
    await signOut()
      .then(() => {
        removeUser()
        console.log("Sign Out Successfully")
      })
      .catch((error) => {
        console.log("Error")
      })
  }

  useEffect(() => {
    setUserInfo(userProfile)
  }, [userProfile])

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerShown: false,
      headerTitle: "Your Profile",
    })
  }, [])

  return (
    <View style={tw("bg-green3 min-h-[100%] px-4")}>
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        transLucent={true}
      />

      {!userInfo ? (
        <Text>Loading...</Text>
      ) : (
        <View style={tw("justify-between h-[80%] mt-8")}>
          <Input
            flex
            fullBorder
            label="Email "
            disabled
            setValue={setEmail}
            defaultVal={userInfo?.email}
          />
          {/* <Input
            flex
            label="Username"
            disabled
            setValue={setUsername}
            defaultVal={userInfo?.username}
          /> */}

          <View style={tw("mt-12")}>
            <Button
              size="sm"
              text={loading ? "Logging Out..." : "Log Out"}
              onPress={handleLogout}
            />
          </View>
        </View>
      )}
    </View>
  )
}

export default ProfileScreen
