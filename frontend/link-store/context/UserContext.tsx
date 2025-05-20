"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  displayName: string;
  email: string;
  confirmed: boolean;
  profileViews: number;
  socialLinks: Array<string>;
  username: string;
  theme: {
    background: string;
    color: string;
    font: string;
  }
  // Add any other user fields you get from your API
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
