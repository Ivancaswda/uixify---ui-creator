// context/SettingContext.tsx
'use client'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"


interface SettingsType {

}

interface RefreshDataContextType {
    refreshData: SettingsType | null;
    setRefreshData: Dispatch<SetStateAction<SettingsType | null>>;
}


const defaultContextValue: RefreshDataContextType = {
    refreshData: null,
    setRefreshData: () => {}
}

export const RefreshDataContext = createContext<RefreshDataContextType>(defaultContextValue)

export const RefreshDataProvider = ({ children }: { children: ReactNode }) => {
    const [refreshData, setRefreshData] = useState<RefreshDataContextType | null>(null)

    return (
        <RefreshDataContext.Provider value={{ refreshData, setRefreshData }}>
            {children}
        </RefreshDataContext.Provider>
    )
}

export const useRefreshData = () => {
    const context = useContext(RefreshDataContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingProvider')
    }
    return context
}