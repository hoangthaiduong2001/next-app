"use client";

import {
  getAccessTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "@/config/storage";
import { decodeToken } from "@/config/utils";
import { RoleType } from "@/types/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import RefreshToken from "./RefreshToken";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const AppContext = createContext({
  isAuth: false,
  roleState: undefined as RoleType | undefined,
  setRole: (roleState?: RoleType | undefined) => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [roleState, setRoleState] = useState<RoleType | undefined>();
  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role);
    if (!role) {
      removeTokenFromLocalStorage();
    }
  }, []);
  const isAuth = Boolean(roleState);
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    if (accessToken) {
      const role = decodeToken(accessToken).role;
      setRoleState(role);
    }
  }, []);
  return (
    <AppContext.Provider value={{ roleState, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
