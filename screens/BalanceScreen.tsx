import { View, Text, Pressable } from "react-native"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../navigator/RootNavigator"
import useAuthStore from "../store/authStore"
import { collection, doc, orderBy, query, updateDoc } from "firebase/firestore"
import { db } from "../config/firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { useTailwind } from "tailwind-rn/dist"
import ModalSettle from "../components/Modal/ModalSettle"

type OrderScreenRouteProp = RouteProp<RootStackParamList, "Balance">

const BalanceScreen = () => {
  const {
    params: { selectedMember },
  } = useRoute<OrderScreenRouteProp>()

  const { currency, userProfile } = useAuthStore()

  const tw = useTailwind()
  const navigation = useNavigation()

  const path = `users/${userProfile?.uid}/members`

  // query for react-firebase-hooks, orderby uid
  const memberQuery = query(collection(db, path), orderBy("uid"))

  // from react-firebase-hooks
  const [docs, loading, error] = useCollectionData(memberQuery)

  const [settleBy, setSettleBy] = useState<string>("")
  const [settleByUid, setSettleByUid] = useState<any>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [membersList, setMembersList] = useState<any>()

  // selected member index
  const selectedMemberIndex = Number(selectedMember) - 1

  console.log("------", selectedMember, selectedMemberIndex)

  // selected member details
  const selectedMemberDetails = membersList && membersList[selectedMemberIndex]

  // calculate balance
  let balance: number = 0

  selectedMemberDetails &&
    selectedMemberDetails?.otherMembers.map((item: any) => {
      balance = Number(
        (Number(item.money) + Number(balance ? balance : 0)).toFixed(2)
      )
    })

  // handle settle amount

  const handleSettle = async () => {
    const settleTo = selectedMember

    const settleToRef = doc(db, path, `${settleTo}`)
    const settleByRef = doc(db, path, `${settleByUid}`)

    const updateSettleByIndex = Object.values(membersList)?.findIndex(
      (item: any) => item.uid === settleByUid
    )

    console.log("updateSettleByIndex", updateSettleByIndex)

    const updateSettleByArr = membersList[updateSettleByIndex].otherMembers

    const updatedSettleToOtherMembersArr =
      selectedMemberDetails.otherMembers.map((item: any) => {
        if (item.uid === settleByUid) {
          return {
            name: item.name,
            uid: item.uid,
            money: item.money,
            settled: true,
          }
        } else return item
      })

    const updatedSettleByOtherMembersArr = updateSettleByArr.map(
      (item: any) => {
        if (item.uid === Number(settleTo)) {
          return {
            name: item.name,
            uid: item.uid,
            money: item.money,
            settled: true,
          }
        } else return item
      }
    )

    setShowModal(false)

    membersList &&
      (await Promise.all([
        // update addTo
        await updateDoc(settleToRef, {
          otherMembers: updatedSettleToOtherMembersArr,
        }),

        // update addBy
        await updateDoc(settleByRef, {
          otherMembers: updatedSettleByOtherMembersArr,
        }),
      ]))

    // toast.success("Settled amount")
  }

  useEffect(() => {
    setMembersList(docs)
  }, [userProfile, docs])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: selectedMemberDetails?.name,
      headerTintColor: "",
      headerTitleStyle: { color: "black" },
      headerBackTitle: "Home",
    })
  }, [selectedMemberDetails])

  return (
    <View style={tw("bg-green3 min-h-[100%] px-4")}>
      <View style={tw("mt-8 flex-row items-center")}>
        <Text style={tw("text-lg font-semibold text-textColor ml-4")}>
          Balance :
        </Text>

        <Text
          style={
            balance && balance < 0
              ? tw("text-errorMsg text-2xl font-bold ml-4")
              : tw("text-green1 text-2xl font-bold ml-4")
          }
        >
          {balance >= 0
            ? `${currency} ${balance}`
            : `- ${currency} ${balance * -1}`}
        </Text>
      </View>

      <View style={tw("mt-8")}>
        {selectedMemberDetails &&
          Object.keys(selectedMemberDetails.otherMembers)?.map((index: any) => (
            <View style={tw("my-2")} key={index}>
              <View
                style={tw(
                  "flex-row justify-between px-4 py-4 bg-green4 flex justify-between rounded-md"
                )}
              >
                <Text style={tw("text-textColor")}>
                  {selectedMemberDetails.otherMembers[index].name}
                </Text>

                <View style={tw("flex-row")}>
                  <Text
                    style={
                      selectedMemberDetails.otherMembers[index].settled
                        ? tw("italic text-textColor")
                        : selectedMemberDetails.otherMembers[index].money >= 0
                        ? tw("text-green1")
                        : tw("text-errorMsg")
                    }
                  >
                    {selectedMemberDetails.otherMembers[index].money >= 0
                      ? `${currency} ${selectedMemberDetails.otherMembers[index].money}`
                      : `- ${currency} ${
                          selectedMemberDetails.otherMembers[index].money * -1
                        }`}
                  </Text>

                  <View style={tw("ml-4")}>
                    <Pressable
                      style={
                        selectedMemberDetails.otherMembers[index].settled
                          ? tw("text-sm font-semibold italic text-[#666]")
                          : tw("text-sm font-semibold text-green1")
                      }
                      onPress={() => {
                        if (
                          !selectedMemberDetails.otherMembers[index].settled
                        ) {
                          setShowModal(!showModal)
                          setSettleBy(
                            selectedMemberDetails.otherMembers[index].name
                          )
                          setSettleByUid(
                            selectedMemberDetails.otherMembers[index].uid
                          )
                        }
                      }}
                    >
                      {selectedMemberDetails.otherMembers[index].settled ? (
                        <Text style={tw("italic")}>Settled</Text>
                      ) : (
                        <Text>Settle</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              </View>

              <ModalSettle
                showModal={showModal}
                handleSettle={handleSettle}
                setShowModal={setShowModal}
                settleBy={settleBy}
              />
            </View>
          ))}
      </View>
    </View>
  )
}

export default BalanceScreen
