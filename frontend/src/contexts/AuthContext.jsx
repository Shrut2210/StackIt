import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("stackit_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      const mockUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
        reputation: 0,
        isAdmin: false,
      };
      setUser(mockUser);
      localStorage.setItem("stackit_user", JSON.stringify(mockUser));
      localStorage.setItem("stackit_token", data.token);
    } else {
      throw new Error(data.message || "Login failed");
    }
    setIsLoading(false);
  };

  const signup = async (username, email, password) => {
    setIsLoading(true);
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 201) {
      const mockUser = {
        id: data.id,
        username,
        email,
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
        reputation: 0,
        isAdmin: false,
      };
      setUser(mockUser);
      localStorage.setItem("stackit_user", JSON.stringify(mockUser));
      localStorage.setItem("stackit_token", data.token);
    } else {
      throw new Error(data.message || "Signup failed");
    }
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("stackit_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
