import { createContext, useContext, useEffect, useState } from "react";
import App from "../App";
import axios from "axios";

//import { attemptGiveUserRandomGoals } from "../../../server/utils/cron";

//get api path from .env file
//const API = import.meta.env.VITE_API || "http://localhost:3000";
//const userAPI = API + "/users";

const authContext = createContext();

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

  useEffect(() => {
    //console.log("test", window.location.pathname);
    if (token) {
      attemptGiveRandomGoals();
    }
  }, [token]);

  async function register(name, email, password) {
    const newUser = { name, email, password };

    const response = await axios.post("/api/users/register", newUser, {
      headers: { "Content-Type": "application/json" },
    });
    setToken(response.data);
    localStorage.setItem("authToken", response.data);
  }

  async function login(email, password) {
    const userInfo = {
      email: email,
      password: password,
    };

    const config = {
      "Content-type": "application/json",
    };

    const response = await axios.post("/api/users/login", userInfo, config);
    setToken(response.data);
    localStorage.setItem("authToken", response.data);
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

      const { data } = await axios.get("/api/users/me", config);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function updateUser(id, name, email, password) {
    const updatedUser = {
      id: id,
      name: name,
      email: email,
      password: password,
    };

    const config = {
      "Content-type": "application/json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      "/api/users/me/update",
      updatedUser,
      config,
    );
    return data;
  }

  async function getSelectedTypes() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get("/api/users/me/types", config);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function addSelectedType(typeId) {
    console.log("new type:", typeId, "| token:", token);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `/api/users/me/types/${typeId}`,
        {},
        config,
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function removeSelectedType(typeId) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `/api/users/me/types/${typeId}`,
        config,
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function attemptGiveRandomGoals() {
    try {
      if (!token) throw new Error("Not logged in");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(`/api/users/me/daily`, {}, config);

      //force refresh if data was made
      if (
        data &&
        (window.location.pathname == "/home" ||
          window.location.pathname == "/schedules")
      ) {
        console.log("refresh");
        window.location.reload();
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  const value = {
    token,
    register,
    login,
    logout,
    getUser,
    updateUser,
    getSelectedTypes,
    addSelectedType,
    removeSelectedType,
  };
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}

export function useAuth() {
  const context = useContext(authContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
