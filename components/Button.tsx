import { View, Text, KeyboardAvoidingView } from "react-native"
import React from "react"
import { Button as Btn } from "@rneui/themed"
import { useTailwind } from "tailwind-rn/dist"

interface IButtonProps {
  size?: "sm"
  text: string
  outline?: boolean
  linkType?: boolean
  onPress?: any
}

const Button: React.FC<IButtonProps> = ({
  size,
  text,
  outline,
  onPress,
  linkType,
}) => {
  const tw = useTailwind()

  if (linkType) {
    return (
      <View>
        <Btn
          title={text}
          type="clear"
          titleStyle={[
            tw(
              `text-green1 ${
                text === "clear" ? "text-md" : "text-sm"
              } font-semibold`
            ),
            text === "clear" && { color: "#000" },
          ]}
          onPress={onPress}
        />
      </View>
    )
  }

  return (
    <View>
      <Btn
        onPress={onPress}
        radius="md"
        titleStyle={
          outline
            ? tw(
                `text-green1 ${
                  size === "sm" ? "text-md" : "text-xl"
                } font-semibold`
              )
            : tw(
                `text-[#fff] ${
                  size === "sm" ? "text-md" : "text-xl"
                } font-semibold`
              )
        }
        buttonStyle={
          outline
            ? [tw("bg-green4 "), { borderColor: "#6B9080", borderWidth: 2 }]
            : tw("bg-green1")
        }
        title={text}
        type={outline ? "outline" : "solid"}
      />
    </View>
  )
}

export default Button
