import { createContext, useContext, useEffect, useState } from "react";
import App from "../App";
import axios from "axios";

//get api path from .env file
const API = import.meta.env.VITE_API || "localhost:3000";
const userAPI = API + "/users";

//create context
const authContext = createContext();

//create provider
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  function attemptGetToken() {
    const localStorageToken = localStorage.getItem("authToken");
    if (localStorageToken) {
      setToken(localStorageToken);
    }
  }

  useEffect(() => {
    attemptGetToken();
  }, []);

  async function register(name, email, password) {
    const newUser = {
      name: name,
      email: email,
      password: password,
    };

    const config = {
      "Content-type": "application/json",
    };

    const response = await axios.post(userAPI + "/register", newUser, config);
    setToken(response.data.token);
    localStorage.setItem("authToken", response.data.token);
  }

  async function login(email, password) {
    const userInfo = {
      email: email,
      password: password,
    };

    const config = {
      "Content-type": "application/json",
    };

    const response = await axios.post(userAPI + "/login", userInfo, config);
    setToken(response.data.token);
    localStorage.setItem("authToken", response.data.token);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("authToken");
  }

  async function getUser() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(userAPI + "/me", config);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const value = { token, register, login, logout, getUser };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

//use context
export function useAuth() {
  const context = useContext(authContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
