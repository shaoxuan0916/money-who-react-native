import { View, Text, Modal } from "react-native"
import React, { Dispatch, SetStateAction } from "react"
import { useTailwind } from "tailwind-rn/dist"
import Button from "../Button"

interface IModalSettleProps {
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  handleSettle: () => void
  settleBy: string
}

const ModalSettle: React.FC<IModalSettleProps> = ({
  setShowModal,
  handleSettle,
  settleBy,
  showModal,
}) => {
  const tw = useTailwind()
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
        <View style={tw("flex-1 max-h-[140px] my-auto  bg-green4 p-4")}>
          {/* Modal Header  */}
          <View style={tw("flex-row justify-between")}>
            <Text style={tw("text-xl font-semibold text-textColor")}>
              Settle amount with {settleBy}?
            </Text>
          </View>

          <View style={tw("flex-row mt-4 w-full")}>
            <View style={tw("flex-1 mr-2")}>
              <Button onPress={handleSettle} text="Yes" />
            </View>
            <View style={tw("flex-1 ml-2")}>
              <Button
                outline={true}
                onPress={() => setShowModal(false)}
                text="No"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ModalSettle
