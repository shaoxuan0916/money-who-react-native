import { View, Text } from "react-native"
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import TabNavigator from "./TabNavigator"
import BalanceScreen from "../screens/BalanceScreen"
import LoginScreen from "../screens/LoginScreen"
import useAuthStore from "../store/authStore"
import WelcomeScreen from "../screens/WelcomeScreen"
import SignupScreen from "../screens/SignupScreen"

export type RootStackParamList = {
  Main: undefined // no props for main screen
  Welcome: undefined
  Login: undefined
  Signup: undefined
  Balance: { selectedMember: string }
}

const RootStack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  const { userProfile } = useAuthStore()

  if (!userProfile)
    return (
      <RootStack.Navigator initialRouteName="Welcome">
        <RootStack.Group>
          <RootStack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
        </RootStack.Group>
      </RootStack.Navigator>
    )

  return (
    <RootStack.Navigator initialRouteName="Main">
      <RootStack.Group>
        <RootStack.Screen name="Main" component={TabNavigator} />
        <RootStack.Screen name="Balance" component={BalanceScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default RootNavigator
