'use client'
// NavbarContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types for the context value
interface NavbarContextType {
    navbarValue: number; // Change to number since you're setting freeWaitingPages as a number
    setNavbarValue: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context with a default value
const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

// NavbarProvider component to wrap your app
interface NavbarProviderProps {
    children: ReactNode;
}

export const NavbarProvider: React.FC<NavbarProviderProps> = ({ children }) => {
    const [navbarValue, setNavbarValue] = useState<number>(0);

    return (
        <NavbarContext.Provider value={{ navbarValue, setNavbarValue }}>
            {children}
        </NavbarContext.Provider>
    );
};

// Custom hook to access the navbar context
export const useNavbar = (): NavbarContextType => {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error('useNavbar must be used within a NavbarProvider');
    }
    return context;
};
