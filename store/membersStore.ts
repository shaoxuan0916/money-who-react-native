import { useEffect } from "react"
import {create} from "zustand"
import { persist } from "zustand/middleware"
import localForage from "localforage";

interface MemberState {
  allMembers: any[]
  updateMembers: (allMembers: any) => void
}

const useMembersStore = create<MemberState>()(
  persist(
    (set) => ({
      allMembers: [],
      updateMembers: (allMembers: any) =>
        set({ allMembers: allMembers }),
    }),
    { name: "allMembers" , storage: localForage as never,}
  )
)

export default useMembersStore
