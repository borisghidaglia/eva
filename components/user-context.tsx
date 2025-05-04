"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getUser } from "@/app/actions/get-user";

export type User = { id: string; email: string };

export const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser()
      .then((res) => {
        if (!(res instanceof Error)) return setUser(res);
        console.error(res.message);
        setUser(null);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setUser(null); // Set user to null if there's an unexpected error
      });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
