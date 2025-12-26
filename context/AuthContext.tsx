"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// 1. تعریف دقیق ساختار اطلاعات کانتکست
interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();


  // login 
  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/auth/me");
      
      if (res.data.user) {
        setUser(res.data.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Auth check failed", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);



  //logout
  const logOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    // حالا تمام مقادیر با Interface مطابقت دارند
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, logOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};