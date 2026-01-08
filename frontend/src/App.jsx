import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Mascot from "./components/Mascot.jsx";
import AIAgent from "./components/AIAgent.jsx";
import HamburgerMenu from "./components/HamburgerMenu.jsx";
import ThemeToggle from "./components/ThemeToggle";
import NotificationsPanel from "./components/NotificationsPanel.jsx";

import "./styles/global.css";
import "./styles/animations.css";
import "./styles/layout.css";
import "./styles/theme-toggle.css";
import "./styles/hamburger.css";
import "./App.css";

import TrackerPage from "./pages/TrackerPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import CampaignsPage from "./pages/CampaignsPage.jsx";
import RewardsPage from "./pages/RewardsPage.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import PolicyDashboard from "./pages/PolicyDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OilFormsPage from "./pages/OilFormsPage.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import FoodAudit from "./pages/FoodAudit.jsx";
import ApiLabelPage from "./pages/ApiLabelPage.jsx";



// ⭐ ADDED
import AdvisoryPage from "./pages/AdvisoryPage.jsx";

/* -------------------------------------------------------
   APP SHELL 
--------------------------------------------------------*/
function AppShell({ currentUser, onLogout }) {
  const role = currentUser?.role || "user";

  return (
    <div className="app-shell">
      <NotificationsPanel />

      <div className="app-top-controls">
        <ThemeToggle />
        <button onClick={onLogout} className="top-logout-btn">
          Logout
        </button>
      </div>

      <header className="app-header">
        <div className="header-left">
          <Mascot />
          <h1 className="brand">Oilwise</h1>
        </div>

        <nav className="nav">
          <NavLink to="/" end>{role === "policy" ? "Dashboard" : "Home"}</NavLink>
          <NavLink to="/tracker">Tracker</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/campaigns">Campaigns</NavLink>
          <NavLink to="/rewards">Rewards</NavLink>
          <NavLink to="/verify">Verify</NavLink>
          <NavLink to="/oil-forms">Used Oil Forms</NavLink>
          <NavLink to="/audit">Food Audit</NavLink>
          <NavLink to="/apilabel">API Labels</NavLink>

          {role === "policy" && (
            <NavLink to="/policy-dashboard">Policy View</NavLink>
          )}

          {/* ⭐ ADDED MENU LINK */}
          <NavLink to="/health-advisory">Health Advisory</NavLink>
        </nav>

        <div className="app-header-right">
          <HamburgerMenu />
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              role === "policy" ? (
                <PolicyDashboard currentUser={currentUser} />
              ) : role === "restaurant" ? (
                <RestaurantDashboard currentUser={currentUser} />
              ) : (
                <HomePage currentUser={currentUser} />
              )
            }
          />

          <Route path="/tracker" element={<TrackerPage currentUser={currentUser} />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/audit" element={<FoodAudit />} />
          <Route path="/apilabel" element={<ApiLabelPage />} />

          <Route
            path="/policy-dashboard"
            element={<PolicyDashboard currentUser={currentUser} />}
          />

          <Route
            path="/oil-forms"
            element={<OilFormsPage currentUser={currentUser} />}
          />

          {/* ⭐ ADDED ROUTE – FIXED COMPONENT NAME */}
          <Route
            path="/health-advisory"
            element={<AdvisoryPage currentUser={currentUser} />}
          />

          {/* Restaurant Dashboard Route */}
          <Route
            path="/restaurant-dashboard"
            element={<RestaurantDashboard currentUser={currentUser} />}
          />
        </Routes>
      </main>

      <AIAgent />
    </div>
  );
}

/* -------------------------------------------------------
   ROOT APP  
--------------------------------------------------------*/
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const loadProfile = async (authUser) => {
    try {
      // 1. Try to fetch profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle(); // Use maybeSingle to avoid 406/JSON errors if row missing

      // 2. Fallback if no profile exists yet
      //    (Common if signup flow failed midway or manual DB edits)
      const profileUser = {
        id: authUser.id,
        email: authUser.email,
        role: data?.role || authUser.user_metadata?.role || "user", // FIX: Read role from metadata if profile missing
        firstName: data?.first_name || authUser.user_metadata?.first_name || "",
        lastName: data?.last_name || authUser.user_metadata?.last_name || "",
        state: data?.state || authUser.user_metadata?.state || "",
        phone: data?.phone || authUser.user_metadata?.phone || "",
        address: data?.address || authUser.user_metadata?.address || "",
      };

      // 3. Update state
      setCurrentUser(profileUser);
      localStorage.setItem("oilwise_current_user", JSON.stringify(profileUser));

      // Optional: Log if profile was missing so we know
      if (!data) {
        console.warn("User logged in but has no profile row. Using fallback.");
      }

    } catch (err) {
      console.error("loadProfile error:", err);
      // Even on error, try to set basic user so they aren't locked out
      setCurrentUser({
        id: authUser.id,
        email: authUser.email,
        role: "user"
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (user) await loadProfile(user);
      else setCurrentUser(null);

      setLoadingAuth(false);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user) loadProfile(user);
      else setCurrentUser(null);

      setLoadingAuth(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("oilwise_current_user");
    setCurrentUser(null);
  };

  if (loadingAuth) {
    return <div style={{ padding: 40 }}>Checking login…</div>;
  }

  return (
    <BrowserRouter>
      {currentUser ? (
        <AppShell currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage />
      )}
    </BrowserRouter>
  );
}

export default App;
