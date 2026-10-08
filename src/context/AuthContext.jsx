import { createContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // on first load: is there a valid login cookie?
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

  const register = async (data) => {
    // registration does not log them in - the Register page sends them to /login
    const res = await registerUser(data);
    return res.data.data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      // even if the request fails, the UI should treat the user as logged out
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, error, setError, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
