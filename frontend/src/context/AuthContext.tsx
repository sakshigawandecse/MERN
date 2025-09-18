import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// User type
interface User {
  _id: string;
  name: string;
  email: string;
}

// Context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load persisted auth state on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.warn("Invalid user in localStorage, clearing it");
        localStorage.removeItem("user");
      }
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

const login = (userData: User, token: string) => {
  console.log("Logging in user:", userData);
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", token);
};


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
