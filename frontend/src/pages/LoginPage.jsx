import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("authTheme") || "light";
    setTheme(savedTheme);
  }, []);

  // Save theme to localStorage when it changes
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("authTheme", newTheme);
  };

  // LOGIN STATES
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // REGISTER STATES
  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    address: "",
    password: "",
    confirmPassword: "",
    phone: "",
    state: "",
    familySize: "4", // Default value
    address: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setReg((prev) => ({ ...prev, [name]: value }));
  };

  // LOGIN SUBMIT
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        window.lastSupabaseError = error; // DEBUG

        if (error.message.includes("Email not confirmed") || error.code === "email_not_confirmed") {
          setLoginError("Please verify your email address before logging in.");
        } else {
          setLoginError("Invalid email or password.");
        }
      }
    } catch (err) {
      window.lastSupabaseError = err; // DEBUG
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER SUBMIT
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    const {
      firstName,
      lastName,
      email,
      phone,
      state,
      familySize,
      address,
      password,
      confirmPassword,
      role,
    } = reg;

    // VALIDATION
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !state ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      setRegError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // 1) SIGNUP AUTH + PROFILE METADATA
      // The Database Trigger will handle inserting into 'profiles'
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            state,
            family_size: familySize,
            address,
            role,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setRegError("Email already exists. Please sign in.");
        } else {
          setRegError("Registration failed. Try again.");
        }
        window.lastSupabaseError = error; // DEBUG
        return;
      }

      setRegSuccess("Account created! Please check your email to verify.");
      setMode("login");
      setLoginEmail(email);

    } catch (err) {
      window.lastSupabaseError = err; // DEBUG
      setRegError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`auth-page ${theme}`}>
      {/* THEME TOGGLE BUTTON */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="auth-container">
        {/* LEFT SIDE - BRANDING */}
        <div className="auth-branding">
          <div className="brand-content">
            <div className="logo-section">
              <div className="logo-icon">🛢️</div>
              <h1 className="brand-title">
                Welcome to <span className="brand-name">Oilwise</span>
              </h1>
            </div>

            <p className="brand-description">
              Track your edible oil usage, explore healthy recipes, unlock rewards,
              and contribute to a healthier India.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Daily oil tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🍳</span>
                <span>Healthy recipes</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Badges & rewards</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Policy dashboards</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">♻️</span>
                <span>Oil collector workflow</span>
              </div>
            </div>

            <div className="decorative-circles">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORMS */}
        <div className="auth-forms">
          {/* MODE TABS */}
          <div className="mode-tabs">
            <button
              className={`tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${mode === "register" ? "active" : ""}`}
              onClick={() => {
                setMode("register");
                setRegSuccess("");
              }}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === "login" && (
            <div className="form-container">
              <h2 className="form-title">Welcome Back!</h2>
              <p className="form-subtitle">Sign in to continue to your account</p>

              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrapper password-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      className="form-input"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="eye-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{loginError}</span>
                      {/* DEBUG: Show tech details if available */}
                      {window.lastSupabaseError && (
                        <pre style={{ fontSize: '10px', marginTop: '4px', maxWidth: '300px', overflow: 'auto' }}>
                          {JSON.stringify(window.lastSupabaseError, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    "Signing In..."
                  ) : (
                    <>
                      Sign In
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => setMode("register")}
                >
                  New to Oilwise? <span className="link-text">Create an account</span>
                </button>
              </form>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <div className="form-container">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Join Oilwise and start your healthy journey</p>

              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="input-row">
                  <div className="input-group">
                    <label className="input-label">First Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                        className="form-input"
                        name="firstName"
                        placeholder="First name"
                        value={reg.firstName}
                        onChange={handleRegChange}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Last Name</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👤</span>
                      <input
                        className="form-input"
                        name="lastName"
                        placeholder="Last name"
                        value={reg.lastName}
                        onChange={handleRegChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      className="form-input"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={reg.email}
                      onChange={handleRegChange}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📱</span>
                      <input
                        className="form-input"
                        name="phone"
                        placeholder="Phone number"
                        value={reg.phone}
                        onChange={handleRegChange}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">State</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📍</span>
                      <input
                        className="form-input"
                        name="state"
                        placeholder="Your state"
                        value={reg.state}
                        onChange={handleRegChange}
                      />
                    </div>
                  </div>
                </div>

                {/* FAMILY SIZE INPUT */}
                <div className="input-row">
                  <div className="input-group">
                    <label className="input-label">Family Size (No. of persons)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">👨‍👩‍👧‍👦</span>
                      <input
                        className="form-input"
                        name="familySize"
                        type="number"
                        min="1"
                        placeholder="e.g. 4"
                        value={reg.familySize}
                        onChange={handleRegChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🏠</span>
                    <textarea
                      className="form-input form-textarea"
                      name="address"
                      placeholder="Enter your address"
                      value={reg.address}
                      onChange={handleRegChange}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Select Role</label>
                  <div className="role-buttons">
                    <button
                      type="button"
                      className={`role-btn ${reg.role === "user" ? "active" : ""}`}
                      onClick={() => setReg((p) => ({ ...p, role: "user" }))}
                    >
                      <span className="role-icon">👤</span>
                      User
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${reg.role === "policy" ? "active" : ""}`}
                      onClick={() => setReg((p) => ({ ...p, role: "policy" }))}
                    >
                      <span className="role-icon">📋</span>
                      Policy Maker
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${reg.role === "collector" ? "active" : ""}`}
                      onClick={() => setReg((p) => ({ ...p, role: "collector" }))}
                    >
                      <span className="role-icon">♻️</span>
                      Collector
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${reg.role === "restaurant" ? "active" : ""}`}
                      onClick={() => setReg((p) => ({ ...p, role: "restaurant" }))}
                    >
                      <span className="role-icon">🍽️</span>
                      Restaurant
                    </button>
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="input-wrapper password-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        className="form-input"
                        name="password"
                        type={showRegPassword ? "text" : "password"}
                        placeholder="Password"
                        value={reg.password}
                        onChange={handleRegChange}
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                      >
                        {showRegPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Confirm</label>
                    <div className="input-wrapper password-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        className="form-input"
                        name="confirmPassword"
                        type={showRegConfirmPassword ? "text" : "password"}
                        placeholder="Confirm"
                        value={reg.confirmPassword}
                        onChange={handleRegChange}
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() =>
                          setShowRegConfirmPassword(!showRegConfirmPassword)
                        }
                      >
                        {showRegConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                </div>

                {regError && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    {regSuccess}
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Account
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => setMode("login")}
                >
                  Already have an account? <span className="link-text">Sign in</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* THEME TOGGLE BUTTON */
        .theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          font-size: 24px;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-toggle:hover {
          transform: scale(1.1) rotate(15deg);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .dark .theme-toggle {
          background: #2d3748;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        /* LIGHT THEME */
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #00b7ff 0%, #ff6ce5 50%, #ffd84d 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          transition: background 0.3s ease;
        }

        .auth-container {
          width: 100%;
          max-width: 1100px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: grid;
          grid-template-columns: 45% 55%;
          overflow: hidden;
          min-height: 650px;
          transition: all 0.3s ease;
        }

        /* DARK THEME */
        .auth-page.dark {
          background: linear-gradient(135deg, #070814 0%, #1a1a5a 50%, #3a0a52 100%);
        }

        .dark .auth-container {
          background: #0f3460;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
        }

        /* LEFT SIDE - BRANDING */
        .auth-branding {
          background: linear-gradient(135deg, #00b7ff 0%, #ff6ce5 50%, #ffd84d 100%);
          padding: 50px 40px;
          color: white;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }

        .dark .auth-branding {
          background: linear-gradient(135deg, #7cf5ff 0%, #ff9bfb 50%, #ffe35b 100%);
        }

        .brand-content {
          position: relative;
          z-index: 2;
        }

        .logo-section {
          margin-bottom: 30px;
        }

        .logo-icon {
          font-size: 48px;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .brand-title {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .brand-name {
          background: linear-gradient(90deg, #fff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-description {
          font-size: 16px;
          line-height: 1.6;
          opacity: 0.95;
          margin-bottom: 40px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          opacity: 0.9;
          transition: transform 0.2s;
        }

        .feature-item:hover {
          transform: translateX(5px);
        }

        .feature-icon {
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }

        .decorative-circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          left: -50px;
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          right: -30px;
        }

        /* RIGHT SIDE - FORMS */
        .auth-forms {
          padding: 50px 45px;
          background: white;
          transition: background 0.3s ease;
        }

        .dark .auth-forms {
          background: #1a1a2e;
        }

        .mode-tabs {
          display: flex;
          gap: 8px;
          background: #f5f7fa;
          padding: 6px;
          border-radius: 12px;
          margin-bottom: 35px;
          transition: background 0.3s ease;
        }

        .dark .mode-tabs {
          background: #0f1419;
        }

        .tab-btn {
          flex: 1;
          padding: 12px 20px;
          border: none;
          background: transparent;
          color: #6c757d;
          font-size: 15px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dark .tab-btn {
          color: #a8b2c1;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #00b7ff 0%, #ff6ce5 50%, #ffd84d 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 183, 255, 0.4);
        }

        .dark .tab-btn.active {
          background: linear-gradient(135deg, #7cf5ff 0%, #ff9bfb 50%, #ffe35b 100%);
          box-shadow: 0 4px 12px rgba(124, 245, 255, 0.4);
        }

        .form-container {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .dark .form-title {
          color: #f8f9fa;
        }

        .form-subtitle {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 30px;
          transition: color 0.3s ease;
        }

        .dark .form-subtitle {
          color: #a8b2c1;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 13px;
          font-weight: 600;
          color: #495057;
          transition: color 0.3s ease;
        }

        .dark .input-label {
          color: #cbd5e0;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .dark .input-wrapper {
          background: #0f1419;
          border-color: #2d3748;
        }

        .input-wrapper:focus-within {
          border-color: #00b7ff;
          background: white;
          box-shadow: 0 0 0 4px rgba(0, 183, 255, 0.1);
        }

        .dark .input-wrapper:focus-within {
          border-color: #7cf5ff;
          background: #1a1a2e;
          box-shadow: 0 0 0 4px rgba(124, 245, 255, 0.1);
        }

        .input-icon {
          padding: 0 12px;
          font-size: 18px;
          color: #6c757d;
          transition: color 0.3s ease;
        }

        .dark .input-icon {
          color: #a8b2c1;
        }

        .form-input {
          flex: 1;
          padding: 12px 12px 12px 0;
          border: none;
          background: transparent;
          font-size: 14px;
          color: #1a1a2e;
          outline: none;
          transition: color 0.3s ease;
        }

        .dark .form-input {
          color: #f8f9fa;
        }

        .form-input::placeholder {
          color: #adb5bd;
        }

        .dark .form-input::placeholder {
          color: #4a5568;
        }

        .form-textarea {
          padding: 12px;
          resize: vertical;
          min-height: 60px;
        }

        .password-wrapper {
          padding-right: 8px;
        }

        .eye-btn {
          border: none;
          background: transparent;
          padding: 8px;
          cursor: pointer;
          font-size: 18px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .eye-btn:hover {
          opacity: 1;
        }

        .role-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .role-btn {
          padding: 14px 12px;
          border: 2px solid #e9ecef;
          background: #f8f9fa;
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #495057;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease;
        }

        .dark .role-btn {
          background: #0f1419;
          border-color: #2d3748;
          color: #cbd5e0;
        }

        .role-btn:hover {
          border-color: #00b7ff;
          background: #f0f5ff;
        }

        .dark .role-btn:hover {
          border-color: #7cf5ff;
          background: #1a1a2e;
        }

        .role-btn.active {
          background: linear-gradient(135deg, #00b7ff 0%, #ff6ce5 50%, #ffd84d 100%);
          border-color: #00b7ff;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 183, 255, 0.3);
        }

        .dark .role-btn.active {
          background: linear-gradient(135deg, #7cf5ff 0%, #ff9bfb 50%, #ffe35b 100%);
          border-color: #7cf5ff;
          box-shadow: 0 4px 12px rgba(124, 245, 255, 0.3);
        }

        .role-icon {
          font-size: 20px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #00b7ff 0%, #ff6ce5 50%, #ffd84d 100%);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 183, 255, 0.4);
        }

        .dark .submit-btn {
          background: linear-gradient(135deg, #7cf5ff 0%, #ff9bfb 50%, #ffe35b 100%);
          box-shadow: 0 4px 12px rgba(124, 245, 255, 0.4);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 183, 255, 0.5);
        }

        .dark .submit-btn:hover {
          box-shadow: 0 6px 20px rgba(124, 245, 255, 0.5);
        }

        .btn-arrow {
          font-size: 18px;
          transition: transform 0.3s ease;
        }

        .submit-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        .switch-mode-btn {
          background: none;
          border: none;
          color: #6c757d;
          font-size: 14px;
          cursor: pointer;
          text-align: center;
          padding: 8px;
          transition: color 0.3s ease;
        }

        .dark .switch-mode-btn {
          color: #a8b2c1;
        }

        .link-text {
          color: #00b7ff;
          font-weight: 600;
          text-decoration: underline;
        }

        .dark .link-text {
          color: #7cf5ff;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fff5f5;
          border: 1px solid #feb2b2;
          border-radius: 8px;
          color: #c53030;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .dark .error-message {
          background: #2d1f1f;
          border-color: #ff5d5d;
          color: #feb2b2;
        }

        .error-icon {
          font-size: 18px;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          border-radius: 8px;
          color: #22543d;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .dark .success-message {
          background: #1f2d24;
          border-color: #48bb78;
          color: #9ae6b4;
        }

        .success-icon {
          font-size: 18px;
        }

        /* RESPONSIVE */
        @media (max-width: 968px) {
          .auth-container {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .auth-branding {
            display: none;
          }

          .auth-forms {
            padding: 40px 30px;
          }
        }

        @media (max-width: 768px) {
          .auth-page {
            padding: 10px;
          }

          .theme-toggle {
            top: 10px;
            right: 10px;
            width: 44px;
            height: 44px;
            font-size: 20px;
          }

          .auth-container {
            min-height: auto;
            border-radius: 16px;
          }

          .auth-forms {
            padding: 30px 20px;
          }

          .form-title {
            font-size: 24px;
          }

          .form-subtitle {
            font-size: 13px;
          }

          .mode-tabs {
            margin-bottom: 25px;
          }

          .tab-btn {
            padding: 10px 16px;
            font-size: 14px;
          }

          .input-label {
            font-size: 12px;
          }

          .form-input {
            font-size: 16px; /* Prevents zoom on iOS */
          }

          .submit-btn {
            padding: 16px 24px; /* Larger touch target */
            font-size: 16px;
          }
        }

        @media (max-width: 640px) {
          .input-row {
            grid-template-columns: 1fr;
          }

          .role-buttons {
            grid-template-columns: 1fr;
          }

          .auth-forms {
            padding: 25px 16px;
          }

          .form-title {
            font-size: 22px;
          }

          .brand-title {
            font-size: 28px;
          }

          .brand-description {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .auth-page {
            padding: 5px;
          }

          .auth-container {
            border-radius: 12px;
          }

          .auth-forms {
            padding: 20px 12px;
          }

          .form-title {
            font-size: 20px;
          }

          .form-subtitle {
            font-size: 12px;
            margin-bottom: 20px;
          }

          .mode-tabs {
            padding: 4px;
            gap: 6px;
          }

          .tab-btn {
            padding: 8px 12px;
            font-size: 13px;
          }

          .input-group {
            gap: 6px;
          }

          .auth-form {
            gap: 16px;
          }

          .role-btn {
            padding: 12px 10px;
            font-size: 12px;
          }

          .role-icon {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}
