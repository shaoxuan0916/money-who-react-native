import { View, Text, SafeAreaView } from "react-native"
import React, { useLayoutEffect } from "react"
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

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Profile">,
  NativeStackNavigationProp<RootStackParamList>
>

const ProfileScreen = () => {
  const tw = useTailwind()
  const navigation = useNavigation<HomeScreenNavigationProp>()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        transLucent={true}
      />
      <Text>Profile Screen</Text>
    </SafeAreaView>
  )
}

export default ProfileScreen
