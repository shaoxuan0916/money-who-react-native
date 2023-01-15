import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native"
import React, { useEffect, useState } from "react"
import useAuthStore, { CurrencyType } from "../store/authStore"
import { TwitterAuthProvider } from "firebase/auth"
import { useTailwind } from "tailwind-rn/dist"
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { Icon } from "@rneui/themed"
import useMembersStore from "../store/membersStore"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { TabStackParamList } from "../navigator/TabNavigator"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigator/RootNavigator"
import ModalAdd from "./Modal/ModalAdd"

interface IUserCardsProps {
  membersList: any[]
  path: string
  currency: CurrencyType
}

export type UsersCardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>

const UserCards: React.FC<IUserCardsProps> = ({
  membersList,
  path,
  currency,
}) => {
  const tw = useTailwind()
  const navigation = useNavigation<UsersCardNavigationProp>()

  const { userProfile } = useAuthStore()

  const [showModal, setShowModal] = useState(false)

  // selected member uid
  const [selectedMember, setSelectedMember] = useState<any>("")
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<any>("")

  return (
    <SafeAreaView>
      <View>
        {membersList &&
          membersList.length !== 0 &&
          Object.keys(membersList).map((member: any, index) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Balance", {
                  selectedMember: membersList[index].uid,
                })
              }
              activeOpacity={1}
              key={index}
              style={tw(
                "flex-row justify-between my-3 items-center bg-green4 py-0.5 px-6 rounded-md"
              )}
            >
              <Text style={tw("text-lg py-3")}>{membersList[index].name}</Text>
              <TouchableOpacity
                style={tw("z-998")}
                activeOpacity={0.7}
                onPress={() => {
                  setShowModal(true)
                  setSelectedMember(membersList[index].uid)
                  setSelectedMemberIndex(index)
                }}
              >
                <Icon
                  name="pluscircle"
                  type="antdesign"
                  iconStyle={tw("text-green1 text-4xl")}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
      </View>

      <ModalAdd
        membersList={membersList}
        showModal={showModal}
        setShowModal={setShowModal}
        currency={currency}
        selectedMember={selectedMember}
        selectedMemberIndex={selectedMemberIndex}
        path={path}
      />
    </SafeAreaView>
  )
}

export default UserCards
