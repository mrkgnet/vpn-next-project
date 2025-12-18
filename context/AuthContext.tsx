"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/auth/me");

      if (res.data.user) {
        setUser(res.data.user);
        setIsLoggedIn(true);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      // ★ تغییر مهم اینجاست:
      // چک میکنیم اگر ارور 401 بود، یعنی فقط کاربر لاگین نیست (عادیه)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // کاربر لاگین نیست -> فقط استیت‌ها رو خالی میکنیم
        setUser(null);
        setIsLoggedIn(false);
        // اینجا دیگه console.error نمیذاریم تا قرمز نشه
      } else {
        // اگر ارور دیگه ای بود (مثلا سرور قطع بود)، اون موقع لاگ بنداز
        console.error("Auth check failed", error);
        setIsLoggedIn(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <AuthContext.Provider
        value={{ user, isLoggedIn, isLoading, logOut, checkAuth }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
