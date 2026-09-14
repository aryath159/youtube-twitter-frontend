import { createContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((er) => {
        setUser(null);
        setError(er);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);

    setUser(res.data.data.user);

    return res.data.data.user;
  };

  const register = async (data)=>{

    const resp = await registerUser(data) ;
    // registration does not login them send them to login 
  }

  const logout = async () =>{
    await logoutUser() ;
    setUser(null) ;
  }

  return (
    <AuthContext value={{ user, setUser, loading, login, error, setError , register , logout }}>
      {children}
    </AuthContext>
  );
}
