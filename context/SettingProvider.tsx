// context/SettingContext.tsx
'use client'
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

// 1. Определяем тип для настроек (замените `any` на конкретный тип)
interface SettingsType {
    // Пример: добавьте ваши реальные поля
    // theme: 'light' | 'dark';
    // language: string;
    // [key: string]: any; // если нужно гибкое определение
}

interface SettingContextType {
    settings: SettingsType | null; // 2. Явно указываем возможное отсутствие данных
    setSettings: Dispatch<SetStateAction<SettingsType | null>>; // 3. Правильная типизация сеттера
}

// 4. Создаем начальное значение по умолчанию
const defaultContextValue: SettingContextType = {
    settings: null,
    setSettings: () => {} // пустая функция-заглушка
}

export const SettingContext = createContext<SettingContextType>(defaultContextValue)

export const SettingProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<SettingsType | null>(null) // 5. Типизируем состояние

    return (
        <SettingContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingProvider')
    }
    return context
}