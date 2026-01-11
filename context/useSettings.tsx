import { useContext } from 'react'

import {SettingContext} from "@/context/SettingProvider";

export const useSettings = () => {
    const context = useContext(SettingContext)
    if (!context) throw new Error('useSetting must be used within an AuthProvider')
    return context
}
