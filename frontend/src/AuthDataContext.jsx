// src/AuthDataContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const USERS_KEY = "ow_users_list";
const CURRENT_USER_KEY = "ow_current_user";
const USAGE_KEY = "ow_usage_list";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadUsage() {
  try {
    return JSON.parse(localStorage.getItem(USAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveUsage(entries) {
  localStorage.setItem(USAGE_KEY, JSON.stringify(entries));
}

const AuthDataContext = createContext(null);

export function AuthDataProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
    } catch {
      return null;
    }
  });
  const [usageEntries, setUsageEntries] = useState(loadUsage);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    saveUsage(usageEntries);
  }, [usageEntries]);

  function signup({ name, email, password, role, state, district }) {
    if (!name || !email || !password || !role) {
      throw new Error("Fill all required fields");
    }
    if (users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role, // "user" or "policymaker"
      state: role === "user" ? state : null,
      district: role === "user" ? district : null,
    };
    const updated = [...users, newUser];
    setUsers(updated);
    setUser(newUser);
  }

  function login(email, password) {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) throw new Error("Invalid email or password");
    setUser(found);
  }

  function logout() {
    setUser(null);
  }

  function addUsage({ date, oilMl }) {
    if (!user || user.role !== "user") return;
    const entry = {
      id: Date.now(),
      userId: user.id,
      state: user.state || "Unknown",
      district: user.district || "Unknown",
      date,
      oilMl: Number(oilMl),
    };
    const updated = [entry, ...usageEntries];
    setUsageEntries(updated);
  }

  return (
    <AuthDataContext.Provider
      value={{ user, users, usageEntries, signup, login, logout, addUsage }}
    >
      {children}
    </AuthDataContext.Provider>
  );
}

export function useAuthData() {
  return useContext(AuthDataContext);
}
