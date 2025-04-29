"use client";

import { getUser } from "@/app/actions/getUser";
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  // Add other user fields as needed
};

export const UserContext = createContext<User | null>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  console.log("provider", { user });

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch((error) => {
        console.error("Error fetching user:", error);
        setUser(null); // Set user to null if there's an error
      });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
