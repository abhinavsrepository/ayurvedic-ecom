"use client";

import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
    isDoctorChatOpen: boolean;
    setIsDoctorChatOpen: (open: boolean) => void;
    isSpinWheelOpen: boolean;
    setIsSpinWheelOpen: (open: boolean) => void;
    isScratchCardOpen: boolean;
    setIsScratchCardOpen: (open: boolean) => void;
    isReferralOpen: boolean;
    setIsReferralOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isDoctorChatOpen, setIsDoctorChatOpen] = useState(false);
    const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
    const [isScratchCardOpen, setIsScratchCardOpen] = useState(false);
    const [isReferralOpen, setIsReferralOpen] = useState(false);

    return (
        <UIContext.Provider
            value={{
                isDoctorChatOpen,
                setIsDoctorChatOpen,
                isSpinWheelOpen,
                setIsSpinWheelOpen,
                isScratchCardOpen,
                setIsScratchCardOpen,
                isReferralOpen,
                setIsReferralOpen,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
