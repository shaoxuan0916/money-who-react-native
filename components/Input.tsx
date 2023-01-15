import { View, Text, TextInput, Keyboard } from "react-native"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useTailwind } from "tailwind-rn/dist"

interface IInputProps {
  label: string
  flex?: boolean
  type?: string
  placeholder?: string
  setValue: Dispatch<SetStateAction<any>>
  clearInput?: boolean
  fullBorder?: boolean
  setClearInput?: Dispatch<SetStateAction<any>>
}

const Input: React.FC<IInputProps> = ({
  label,
  flex,
  type,
  placeholder,
  setValue,
  fullBorder,
  clearInput,
  setClearInput,
}) => {
  const [val, setVal] = useState<any>("")

  const tw = useTailwind()

  const tempFunction = () => {
    setVal("")

    setClearInput && setClearInput(false)
  }

  useEffect(() => {
    tempFunction()
  }, [clearInput])

  return (
    <View style={flex ? tw("flex-row items-center w-full") : tw("my-4")}>
      <Text
        style={
          flex ? tw("w-20 text-lg") : tw("text-xl font-semibold text-textColor")
        }
      >
        {label}
      </Text>

      <TextInput
        autoComplete="off"
        value={val}
        onChangeText={(text) => {
          setValue(text)
          setVal(text)
        }}
        placeholder={placeholder}
        style={[
          fullBorder
            ? {
                borderWidth: 1,
                borderRadius: 4,
                marginTop: 2,
                backgroundColor: "#fff",
                paddingLeft: 8,
                paddingVertical: 6,
              }
            : { borderBottomColor: "#666", borderBottomWidth: 0.5 },
          flex && { width: "70%" },
        ]}
        secureTextEntry={type === "password" ? true : false}
        keyboardType={type === "number" ? "number-pad" : "default"}
      />
    </View>
  )
}

export default Input
