import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Popular from "./components/Popular";
import Search from "./components/Search";
import Wishlist from "./components/Wishlist";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* 임시 네비게이션 */}
      <nav
        style={{ padding: "20px", background: "#333", marginBottom: "20px" }}
      >
        <Link to="/" style={{ color: "white", margin: "0 10px" }}>
          Home
        </Link>
        <Link to="/signin" style={{ color: "white", margin: "0 10px" }}>
          Sign In
        </Link>
        <Link to="/popular" style={{ color: "white", margin: "0 10px" }}>
          Popular
        </Link>
        <Link to="/search" style={{ color: "white", margin: "0 10px" }}>
          Search
        </Link>
        <Link to="/wishlist" style={{ color: "white", margin: "0 10px" }}>
          Wishlist
        </Link>
      </nav>

      {/* 라우팅 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/search" element={<Search />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </div>
  );
}

export default App;
