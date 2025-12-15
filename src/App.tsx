import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Popular from "./components/Popular";
import Search from "./components/Search";
import Wishlist from "./components/Wishlist";
import "./App.css";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <div className="App">
      <NavigationBar />
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
