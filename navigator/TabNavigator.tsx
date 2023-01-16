import { View, Text } from "react-native"
import React, { useLayoutEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import { useNavigation } from "@react-navigation/native"
import { Icon } from "@rneui/themed"

export type TabStackParamList = {
  Home: undefined
  Profile: undefined
}

const Tab = createBottomTabNavigator<TabStackParamList>()

const TabNavigator = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#6B9080",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return (
              <Icon
                name="home"
                type="antdesign"
                color={focused ? "#6B9080" : "gray"}
              />
            )
          } else if (route.name === "Profile") {
            return (
              <Icon
                name="person-outline"
                type="ionicons"
                color={focused ? "#6B9080" : "gray"}
              />
            )
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default TabNavigator
