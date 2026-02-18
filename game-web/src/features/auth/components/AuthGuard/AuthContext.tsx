import { createContext, ReactNode, useContext } from "react";
import { User } from "../../models/user";

type AuthContextValues = { user: User; logout: () => void };

const AuthContext = createContext<AuthContextValues | null>(null);

export const AuthContextProvider = ({
  children,
  user,
  logout,
}: {
  children: ReactNode;
  user: User;
  logout: () => void;
}) => {
  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (consumer: string) => {
  const context = useContext(AuthContext);

  if (context == null)
    throw new Error(consumer + " shoudl by used with [AuthContextProvider]");

  return context;
};
