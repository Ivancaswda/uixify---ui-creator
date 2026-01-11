'use client'
import React, { createContext, useContext, useEffect, useState } from "react";

type Ctx = {
    geminiApiKey: string | null;
    setGeminiApiKey: (k: string | null) => void;
};

const GeminiApiKeyContext = createContext<Ctx | null>(null);

export const GeminiApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
    const [geminiApiKey, setGeminiApiKeyState] = useState<string | null>(null);

    // ✅ загрузка при старте
    useEffect(() => {
        const stored = localStorage.getItem("geminiApiKey");
        if (stored) setGeminiApiKeyState(stored);
    }, []);

    // ✅ setter + persist
    const setGeminiApiKey = (key: string | null) => {
        if (key) {
            localStorage.setItem("geminiApiKey", key);
            setGeminiApiKeyState(key);
        } else {
            localStorage.removeItem("geminiApiKey");
            setGeminiApiKeyState(null);
        }
    };

    return (
        <GeminiApiKeyContext.Provider value={{ geminiApiKey, setGeminiApiKey }}>
            {children}
        </GeminiApiKeyContext.Provider>
    );
};

export const useGeminiApiKey = () => {
    const ctx = useContext(GeminiApiKeyContext);
    if (!ctx) {
        throw new Error("useGeminiApiKey must be used inside GeminiApiKeyProvider");
    }
    return ctx;
};
