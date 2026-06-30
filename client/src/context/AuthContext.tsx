import { createContext, useEffect, useState } from "react";

import api from "../api/api"

type User = {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: false,
});

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const refresh = async () => {
      setLoading(true)
      try{
        const { data } = await api.post('/auth/refresh')
        window.__AccessToken__ = data.accessToken
        setUser(data.user) 
      } catch(e){

      } finally {
        setLoading(false)
      }
    };
    refresh()
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
