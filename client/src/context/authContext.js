
import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  
  const login = async (inputs) => {
    const res = await axios.post(process.env.REACT_APP_API_URL+"/api/auth/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data)
    localStorage.setItem("refresh_token", res.data.refresh_token);
  };
  const logout = async () => {
    const refresh_token = { refresh_token: localStorage.getItem("refresh_token") };
    await axios.post(process.env.REACT_APP_API_URL+"/api/auth/logout",refresh_token, {
      withCredentials: true,
    });
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    setCurrentUser(null);
  };
  const verify_email = async (token) => {
    await axios.post(process.env.REACT_APP_API_URL+"/api/auth/register/verify_email", token, {
      withCredentials: true,
    });
    
  }
  const request_reset_password = async (email) => {
    await axios.post(process.env.REACT_APP_API_URL+"/api/auth/reset-password/request", {email}, {
      withCredentials: true,
    });
  }
  const verify_reset_password = async (token, email) => {
    const data = { ...token, email };
    await axios.post(process.env.REACT_APP_API_URL+"/api/auth/reset-password/confirm",data, {
      withCredentials: true,
    });
    sessionStorage.setItem("isVerified", "true");
  }
  const change_password = async (input) => {
    await axios.post(process.env.REACT_APP_API_URL+"/api/auth/change-password/",input, {
      withCredentials: true,
    });
    sessionStorage.removeItem("isVerified");
    sessionStorage.removeItem("email");


  }
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout , verify_email,request_reset_password,verify_reset_password,change_password }}>
      {children}
    </AuthContext.Provider>
  );
};