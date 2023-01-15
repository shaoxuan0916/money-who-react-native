import { View, Text, TextInput, SafeAreaView } from "react-native"
import React, { Dispatch, SetStateAction } from "react"

import { useTailwind } from "tailwind-rn/dist"
import { Button } from "@rneui/themed"

interface IAddUserInputProps {
  value: any
  setValue: Dispatch<SetStateAction<any>>
  handleAdd: () => void
}

const AddUserInput: React.FC<IAddUserInputProps> = ({
  setValue,
  value,
  handleAdd,
}) => {
  const tw = useTailwind()

  return (
    <View style={tw("mt-16 flex-row w-full")}>
      <View style={tw("pt-3 w-[80%] rounded-l-md bg-green4 text-textColor")}>
        <TextInput
          autoComplete="off"
          value={value}
          placeholder="Add new member"
          onChangeText={(text) => {
            setValue(text)
          }}
          style={tw("px-4")}
        />
      </View>

      <View style={tw("w-[20%]")}>
        <Button
          title="Add"
          onPress={handleAdd}
          buttonStyle={tw("bg-green1 py-3 rounded-r-md")}
        />
      </View>
    </View>
  )
}

export default AddUserInput
