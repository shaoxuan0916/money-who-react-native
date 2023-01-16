import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { TabStackParamList } from "../navigator/TabNavigator"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigator/RootNavigator"
import { useTailwind } from "tailwind-rn/dist"
import { useCollectionData } from "react-firebase-hooks/firestore"
import FocusedStatusBar from "../components/FocusedStatusBar"
import useAuthStore, { currencyOptions, CurrencyType } from "../store/authStore"
import useMembersStore from "../store/membersStore"
import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore"
import { db } from "../config/firebase"
import AddUserInput from "../components/AddUserInput"
import Button from "../components/Button"
import ModalAADrawUp from "../components/Modal/ModalAADrawUp"
import ModalClear from "../components/Modal/ModalClear"
import UserCards from "../components/UserCards"
import DropDownPicker from "react-native-dropdown-picker"
// import toast from "react-hot-toast"

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>

const HomeScreen = () => {
  const tw = useTailwind()
  const navigation = useNavigation<HomeScreenNavigationProp>()

  const { userProfile, currency, updateCurrency } = useAuthStore()
  const { updateMembers, allMembers } = useMembersStore()

  const path = `users/${userProfile?.uid}/members`

  // query for react-firebase-hooks, orderby uid
  const memberQuery = query(collection(db, path), orderBy("uid"))

  // from react-firebase-hooks
  const [docs, loading, error] = useCollectionData(memberQuery)

  const [open, setOpen] = useState<boolean>(false)
  const [curChange, setCurChange] = useState<CurrencyType>("RM")
  const [currencyList, setCurrencyList] = useState<any>(["USD", "RMB", "RM"])
  const [newMember, setNewMember] = useState("")
  const [sessionExpired, setSessionExpired] = useState<boolean>(false)
  const [showAddModalAA, setShowModalAA] = useState(false)
  const [showModalClear, setShowModalClear] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  // new member's other members
  const newMemberOtherMembers =
    allMembers &&
    Object.keys(allMembers).map((member, index) => ({
      name: allMembers[index].name,
      uid: allMembers[index].uid,
      money: Number(0),
    }))

  // add new member
  const handleAdd = async () => {
    if (newMember === "" || newMember === undefined) return
    setNewMember("")

    const newMemberUid = allMembers && Object.keys(allMembers).length + 1

    const docRef = doc(db, path, `${newMemberUid}`)

    // add new member to old member(s)'s other members
    Object.keys(allMembers).map((member, index) => {
      updateOtherMembers(newMember, newMemberUid, index)
    })

    await setDoc(
      docRef,
      {
        name: newMember,
        uid: newMemberUid,
        otherMembers: newMemberOtherMembers,
      }
      // { merge: true }
    )

    // toast.success("New member added")
  }

  // function update old member(s)'s other members
  const updateOtherMembers = async (
    newMember: any,
    newMemberUid: any,
    index: any
  ) => {
    const currentDocRef = doc(db, path, `${index + 1}`)

    // previous other members
    const oldOtherMembers = allMembers[index]?.otherMembers

    // updated other members
    const newOtherMembersArr = [
      ...oldOtherMembers,
      { name: newMember, uid: newMemberUid, money: 0 },
    ]

    await setDoc(
      currentDocRef,
      {
        otherMembers: newOtherMembersArr,
      },
      {
        merge: true,
      }
    )
  }

  // function clear all members
  const handleClearMember = () => {
    Object.keys(allMembers).map((member, index) => {
      handleDeleteDoc(index)
    })

    // toast.success("All members cleared")
    setShowModalClear(false)
  }

  const handleDeleteDoc = async (index: any) => {
    const docRef = doc(db, `${path}/${index + 1}`)
    await deleteDoc(docRef)
  }

  useEffect(() => {
    updateMembers(docs)

    if (!userProfile) {
      setSessionExpired(true)
    }
  }, [docs, userProfile])

  useEffect(() => {
    const list = currencyOptions?.map((currency: any) => ({
      label: currency,
      value: currency,
    }))
    setCurrencyList(list)
  }, [currencyOptions])

  useEffect(() => {
    updateCurrency(curChange)
  }, [curChange])

  return (
    <View style={tw("bg-green2 min-h-[100%] px-4")}>
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        transLucent={true}
      />

      {loading ? (
        <View style={tw("mt-16")}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={tw("flex-1")}>
          <AddUserInput
            value={newMember}
            setValue={setNewMember}
            handleAdd={handleAdd}
          />

          <TouchableOpacity style={tw("mt-8 mb-4")}>
            <Button
              onPress={() => {
                setShowModalAA(true)
              }}
              text="AA Draw Up"
            />
          </TouchableOpacity>

          <ModalAADrawUp
            showModal={showAddModalAA}
            setShowModal={setShowModalAA}
            membersList={allMembers}
            path={path}
          />

          {/* clear all users and currency*/}
          {allMembers?.length > 0 && (
            <View style={tw("flex-row justify-between items-center h-12 my-4")}>
              <View style={tw("w-[30%]")}>
                <DropDownPicker
                  style={tw("")}
                  placeholder="Currency"
                  open={open}
                  value={curChange}
                  items={currencyList}
                  setOpen={setOpen}
                  setValue={setCurChange}
                  setItems={setCurrencyList}
                />
              </View>
              <View style={tw("")}>
                <Button
                  onPress={() => setShowModalClear(true)}
                  text="clear"
                  linkType={true}
                />
              </View>
            </View>
          )}

          <ModalClear
            setShowModal={setShowModalClear}
            showModal={showModalClear}
            handleClearMember={handleClearMember}
          />

          {/* User Card */}

          <ScrollView style={tw("")}>
            {allMembers && allMembers.length > 0 ? (
              <UserCards
                currency={currency}
                path={path}
                membersList={allMembers}
              />
            ) : (
              <Text style={tw("text-lg mt-16 pl-2 text-textColor")}>
                No member yet :(
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  )
}

export default HomeScreen
