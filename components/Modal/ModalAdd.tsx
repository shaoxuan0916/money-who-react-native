import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Keyboard,
} from "react-native"
import React, { Dispatch, SetStateAction } from "react"
import { useTailwind } from "tailwind-rn/dist"
import { Icon } from "@rneui/themed"
import Button from "../Button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"
import { CurrencyType } from "../../store/authStore"
import AddAmountInput from "../AddAmountInput"

interface IModalAddProps {
  path: string
  selectedMember: number
  selectedMemberIndex: number
  setShowModal: Dispatch<SetStateAction<boolean>>
  showModal: boolean
  membersList: any[] | null
  currency: CurrencyType
}

const ModalAdd: React.FC<IModalAddProps> = ({
  selectedMember,
  selectedMemberIndex,
  setShowModal,
  showModal,
  membersList,
  path,
  currency,
}) => {
  const tw = useTailwind()

  const selectedMemberDetails = membersList?.find(
    (item) => item.uid === selectedMember
  )

  // function add money --> when click "add" button
  const handleAddMoney = async (addBy: any, amount: any) => {
    // addTo is owner

    if (!amount) {
      return
    }

    const addTo = selectedMember

    await updateMoney(addTo, addBy, amount)
      .then((doc) => {
        console.log("success", doc)
      })
      .catch((error) => {
        console.log("errorrrrrr", error)
      })

    // toast.success(`${currency} ${amount} successfully added`)
  }

  const updateMoney = async (addTo: any, addBy: any, amount: any) => {
    // updated "addTo"'s otherMembers Array
    const updateIndex =
      selectedMemberDetails.otherMembers &&
      Object.values(selectedMemberDetails.otherMembers).findIndex(
        (item: any) => item.uid === addBy
      )

    // calculate amount after changes
    const updatedAddToAmount = Number(
      (
        Number(selectedMemberDetails?.otherMembers[updateIndex].money) +
        Number(amount)
      ).toFixed(2)
    )

    const updatedAddByAmount = updatedAddToAmount * -1

    // find addBy index and otherMembersArr

    const updateAddByIndex =
      membersList &&
      Object.values(membersList)?.findIndex((item: any) => item.uid === addBy)

    // @ts-ignore
    const updateAddByArr = membersList[updateAddByIndex].otherMembers

    const addToRef = doc(db, path, `${addTo}`)
    const addByRef = doc(db, path, `${addBy}`)

    const updatedAddToOtherMembersArr = selectedMemberDetails.otherMembers.map(
      (item: any) => {
        if (item.uid === addBy) {
          return {
            name: item.name,
            uid: item.uid,
            money: updatedAddToAmount,
          }
        } else return item
      }
    )

    const updatedAddByOtherMembersArr = updateAddByArr.map((item: any) => {
      if (item.uid === addTo) {
        return {
          name: item.name,
          uid: item.uid,
          money: updatedAddByAmount,
        }
      } else return item
    })

    // update latest money status to firestore
    membersList &&
      (await Promise.all([
        // update addTo
        updateDoc(addToRef, {
          otherMembers: updatedAddToOtherMembersArr,
        }),
        // update addBy
        updateDoc(addByRef, {
          otherMembers: updatedAddByOtherMembersArr,
        }),
      ]))
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={showModal}
      onDismiss={() => setShowModal(!showModal)}
      onRequestClose={() => {
        setShowModal(!showModal)
      }}
    >
      <View style={tw("flex-1 bg-[#333]/75 top-0 bottom-0 left-0 right-0 ")}>
        <View style={tw("flex-1 max-h-[400px] my-auto  bg-green4 p-4")}>
          {/* Modal Header  */}
          <View
            style={[
              tw("flex-row justify-between pb-2"),
              { shadowOffset: 1, shadowColor: "#000", shadowOpacity: 1 },
            ]}
          >
            <Text style={tw("text-xl font-semibold text-textColor")}>
              {selectedMemberDetails?.name}
            </Text>

            <Pressable onPress={() => setShowModal(false)}>
              <Icon name="x" type="feather" />
            </Pressable>
          </View>

          {/* Modal Body */}

          <ScrollView style={tw("pt-2")} keyboardShouldPersistTaps="handled">
            {membersList &&
              Object.keys(membersList).map(
                (member, index) =>
                  member !== selectedMemberIndex.toString() && (
                    <View style={tw("my-2")}>
                      <AddAmountInput
                        currency={currency}
                        member={membersList[index]}
                        handleAddMoney={handleAddMoney}
                      />
                    </View>
                  )
              )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

export default ModalAdd
