import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Popular from "./components/Popular";
import Search from "./components/Search";
import Wishlist from "./components/Wishlist";
import "./App.css";
import NavigationBar from "./components/NavigationBar";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const isSignInPage = location.pathname === "/signin";
  const currentUser = localStorage.getItem("currentUser");

  return (
    <div className="App">
      <ToastContainer />
      {!isSignInPage && currentUser && <NavigationBar />}

      <Routes>
        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/popular"
          element={
            <ProtectedRoute>
              <Popular />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
