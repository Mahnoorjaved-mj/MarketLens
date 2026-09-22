import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, toast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setBusy(true);

    try {
      await login(email, password);
      toast("Welcome back to MarketLens!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Failed to log in");
      toast(err.message || "Failed to log in", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("admin@marketlens.com");
    setPassword("MarketLens123!");
    setErrorMessage("");
    setBusy(true);

    try {
      await login("admin@marketlens.com", "MarketLens123!");
      toast("Logged in as Demo Admin", "success");
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Demo login failed");
      toast(err.message || "Demo login failed", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-logo">M</div>
          <div>
            <h2>MarketLens</h2>
            <span>Enterprise Analytics Workspace</span>
          </div>
        </div>

        {/* Title */}
        <div className="auth-title-box">
          <h3>Sign in to your account</h3>
          <p>Access your real-time analytics, forecasting, and insights</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-error-banner">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={17} />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-group-label-row">
              <label>Password</label>
            </div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={17} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="spin-icon" size={16} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Button */}
        <div className="demo-login-box">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="demo-login-btn"
            disabled={busy}
          >
            <Sparkles size={15} style={{ color: "#6366f1" }} />
            <span>Quick Fill Admin Demo</span>
          </button>
        </div>

        {/* Footer */}
        <div className="auth-card-footer">
          <span>Don't have an account?</span>{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
