import { View, Text, Modal, Pressable } from "react-native"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useTailwind } from "tailwind-rn/dist"
import { Icon } from "@rneui/themed"
import DropDownPicker from "react-native-dropdown-picker"
import Input from "../Input"
import Button from "../Button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"

interface IModalAddAADrawUpProps {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  membersList: any
  path: string
}

const ModalAADrawUp: React.FC<IModalAddAADrawUpProps> = ({
  showModal,
  setShowModal,
  membersList,
  path,
}) => {
  const tw = useTailwind()

  const [open, setOpen] = useState<boolean>(false)
  const [addTo, setAddTo] = useState<string>("")
  const [amount, setAmount] = useState<number>(0)
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [clearInput, setClearInput] = useState<boolean>(false)
  const [items, setItems] = useState<any[]>([])

  const membersNumber = Number(membersList?.length)

  const handleAdd = async (e: any) => {
    setErrorMsg("")

    e.preventDefault()

    if (amount === 0 || addTo === "") {
      setErrorMsg("Please fill in the blanks")
      return
    }

    let dividedAmount = amount / membersNumber

    await Promise.all([
      // update all add by(s) other members list
      updateAddByMoney(dividedAmount),
      // update add to other members list
      updateAddToMoney(addTo, dividedAmount),
    ])

    setAmount(0)
    setAddTo("")
    setClearInput(true)

    // toast.success("AA draw up had been added")
    setShowModal(false)
  }

  // update addTo other members (add amount to all of them)
  const updateAddToMoney = (addTo: any, dividedAmount: number) => {
    const addToRef = doc(db, path, `${addTo}`)

    const updatedAddToOtherMembersArr = membersList[addTo - 1].otherMembers.map(
      (item: any) => {
        return {
          name: item.name,
          uid: item.uid,
          money: Number(
            Number(Number(item.money) + Number(dividedAmount)).toFixed(2)
          ),
        }
      }
    )

    // console.log("addTo", addToRef, updatedAddToOtherMembersArr)
    updateDoc(addToRef, {
      otherMembers: updatedAddToOtherMembersArr,
    })
  }

  // update all addBy(s) other members (add amount to all of them)
  const updateAddByMoney = (dividedAmount: number) => {
    membersList &&
      Object.values(membersList).map((member: any) => {
        const addByUid = member.uid
        const addByRef = doc(db, path, `${addByUid}`)

        // find current addBy's other members
        const updatedAddByOtherMembersArr = member.otherMembers.map(
          (item: any) => {
            if (item.uid === Number(addTo)) {
              return {
                name: item.name,
                uid: item.uid,
                money: Number(
                  Number(Number(item.money) - Number(dividedAmount)).toFixed(2)
                ),
              }
            } else return item
          }
        )

        // console.log("addBy", addByRef, updatedAddByOtherMembersArr)
        updateDoc(addByRef, {
          otherMembers: updatedAddByOtherMembersArr,
        })
      })
  }

  useEffect(() => {
    const members = membersList?.map((member: any) => ({
      label: member.name,
      value: member.uid,
    }))
    setItems(members)
  }, [membersList])
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
          <View style={tw("flex-row justify-between")}>
            <Text style={tw("text-xl font-semibold text-textColor")}>
              AA Draw Up
            </Text>

            <Pressable onPress={() => setShowModal(false)}>
              <Icon name="x" type="feather" />
            </Pressable>
          </View>

          {/* Modal Body */}

          <View style={tw("pt-6")}>
            <Text style={tw("mb-4 text-xl font-semibold text-textColor")}>
              Who pays first
            </Text>
            <DropDownPicker
              open={open}
              value={addTo}
              items={items}
              setOpen={setOpen}
              setValue={setAddTo}
              setItems={setItems}
            />

            <View style={tw("my-2")}>
              <Input
                fullBorder
                label="Amount :"
                type="number"
                setValue={setAmount}
                clearInput={clearInput}
                setClearInput={setClearInput}
              />
            </View>

            {errorMsg && <div className="text-errorMsg pb-4">{errorMsg}</div>}

            <Button onPress={handleAdd} text="Add" />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ModalAADrawUp
