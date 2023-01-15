import { StatusBar } from "react-native"
import { useIsFocused } from "@react-navigation/native"

const FocusedStatusBar = (props: any) => {
  const isFoused = useIsFocused()

  return isFoused ? <StatusBar animated={true} {...props} /> : null
}

export default FocusedStatusBar
