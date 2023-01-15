import { View, Text } from "react-native"
import React, { useState } from "react"
import Input from "./Input"
import Button from "./Button"
import { useTailwind } from "tailwind-rn/dist"

interface IAddAmountInputProps {
  currency: string
  member: any
  handleAddMoney: (addBy: any, amount: any) => void
}

const AddAmountInput = ({
  currency,
  member,
  handleAddMoney,
}: IAddAmountInputProps) => {
  const tw = useTailwind()
  const [amount, setAmount] = useState<number>(0)
  const [clearInput, setClearInput] = useState<boolean>(false)
  return (
    <View style={tw("flex-row items-center w-full")}>
      <View style={tw("w-[85%]")}>
        <Input
          fullBorder
          setClearInput={setClearInput}
          clearInput={clearInput}
          flex
          placeholder={currency}
          label={member.name}
          setValue={setAmount}
          type="number"
        />
      </View>

      <View style={tw("w-[15%]")}>
        <Button
          onPress={() => {
            handleAddMoney(member?.uid, amount)
            setAmount(0)
            setClearInput(true)
          }}
          text="Add"
        />
      </View>
    </View>
  )
}

export default AddAmountInput
