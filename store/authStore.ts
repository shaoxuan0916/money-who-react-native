import {create} from "zustand"
import { persist } from "zustand/middleware"
import localForage from "localforage";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const currencyOptions:any = ["USD", "RMB", "RM"]

export type CurrencyType = "USD" | "RMB" | "RM"


interface AuthState {
  currency: CurrencyType
  userProfile: any
  updateCurrency: (currency: CurrencyType) => void
  addUser: (user: any) => void
  removeUser: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
  (set) => ({
  currency: "RM",
  userProfile: null,
  updateCurrency: (currency: CurrencyType) => set({ currency: currency }),
  addUser: (user: any) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),
}), {
  name:"auth",
  storage: localForage as never,
  // storage: AsyncStorage as never ,
})
)

export default useAuthStore
