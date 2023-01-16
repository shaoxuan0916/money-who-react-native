import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { Toaster } from "react-hot-toast"
import { StyleSheet, Text, View } from "react-native"
import { TailwindProvider } from "tailwind-rn"
import RootNavigator from "./navigator/RootNavigator"
import utilities from "./tailwind.json"

export default function App() {
  return (
    <>
      {/* @ts-ignore */}
      <TailwindProvider utilities={utilities}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        {/* <Toaster position="top-center" reverseOrder={false} /> */}
      </TailwindProvider>
    </>
  )
}
