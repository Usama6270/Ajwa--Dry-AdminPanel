import React, { useEffect, useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme"; // Assuming you have this function for theme config
import { setUser } from "./state/globalReducer"; // Action to set user data in Redux

import Dashboard from "scenes/dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "scenes/layout";  // Your layout component containing sidebar/navigation
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Performance from "scenes/performance";
import Settings from "scenes/settings"; // Import the Settings component

function App() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.global.mode); // Get theme mode from Redux
  const user = useSelector((state) => state.global.user); // User from Redux store
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // Check authentication status when the app is first loaded
  useEffect(() => {
    const token = localStorage.getItem("token");
    let userData = null;

    try {
      userData = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      console.error("Error parsing user data from localStorage", e);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    if (token && userData) {
      dispatch(setUser(userData)); // Set user data in Redux
    }
  }, [dispatch]);

  const isAuthenticated = user || localStorage.getItem("token"); // Check if authenticated

  return (
    <div className="app">
      <HashRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Authentication Routes */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />}
            />

            {/* Protected Routes (only accessible if logged in) */}
            <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/settings" element={<Settings />} /> {/* Add settings route */}
            </Route>
          </Routes>
        </ThemeProvider>
      </HashRouter>
    </div>
  );
}

export default App;
