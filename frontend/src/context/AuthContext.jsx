import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const AuthContext = createContext(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const TOKEN_KEY = "marketlens_token";
const USER_KEY = "marketlens_user";

const TOAST_ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warn: AlertTriangle,
  info: Info,
};

let toastCounter = 0;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast Notification System
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "info") => {
      const id = ++toastCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), 3500);
    },
    [dismissToast]
  );

  // Sync token and user with localStorage
  const saveAuth = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    }

    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } else {
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  };

  // Verify token on mount
  useEffect(() => {
    let isMounted = true;
    async function verifyMe() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        if (isMounted) setLoadingAuth(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        } else {
          // Token is invalid/expired
          saveAuth(null, null);
        }
      } catch {
        // If network issue, keep stored user for offline resilience
      } finally {
        if (isMounted) setLoadingAuth(false);
      }
    }

    verifyMe();
    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.detail || "Invalid login credentials";
      throw new Error(msg);
    }

    saveAuth(data.token, data.user);
    return data.user;
  };

  // Register handler
  const register = async (email, password, name) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.detail || "Registration failed";
      throw new Error(msg);
    }

    saveAuth(data.token, data.user);
    return data.user;
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    } finally {
      saveAuth(null, null);
      toast("Logged out successfully", "info");
    }
  };

  const value = {
    user,
    token,
    loadingAuth,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    toast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Floating Toast Alerts */}
      <div className="toast-container" style={{ position: "fixed", top: "18px", right: "20px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
        {toasts.map((t) => {
          const Icon = TOAST_ICONS[t.type] || Info;
          const bgColors = {
            success: "#065f46",
            error: "#991b1b",
            warn: "#854d0e",
            info: "#1e1b4b",
          };
          const borderColors = {
            success: "#10b981",
            error: "#ef4444",
            warn: "#f59e0b",
            info: "#6366f1",
          };

          return (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: bgColors[t.type] || "#0f172a",
                color: "#ffffff",
                borderRadius: "10px",
                border: `1px solid ${borderColors[t.type] || "#334155"}`,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.4)",
                minWidth: "260px",
                maxWidth: "380px",
                fontSize: "13px",
                fontWeight: "500",
                animation: "toastSlideIn 0.25s ease-out",
              }}
            >
              <Icon size={18} style={{ color: borderColors[t.type] || "#6366f1", flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                onClick={() => dismissToast(t.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </AuthContext.Provider>
  );
}
