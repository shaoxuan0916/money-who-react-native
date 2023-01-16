import { View, Text, TextInput, Keyboard } from "react-native"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useTailwind } from "tailwind-rn/dist"

interface IInputProps {
  label: string
  flex?: boolean
  type?: string
  placeholder?: string
  disabled?: boolean
  defaultVal?: any
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
  disabled,
  defaultVal,
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
          flex ? tw("w-24 text-lg") : tw("text-xl font-semibold text-textColor")
        }
      >
        {label}
      </Text>

      <TextInput
        editable={disabled ? false : true}
        autoComplete="off"
        value={defaultVal ? defaultVal : val}
        onChangeText={(text) => {
          setValue(text)
          setVal(text)
        }}
        placeholder={placeholder}
        style={[
          fullBorder
            ? {
                borderWidth: 0.5,
                borderRadius: 4,
                marginTop: 2,
                backgroundColor: "#fff",
                paddingLeft: 8,
                paddingVertical: 6,
                borderColor: "#666",
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
