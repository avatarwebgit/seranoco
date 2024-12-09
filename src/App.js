import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./App.css";
function App() {
  const [windowSize, setWindowSize] = useState("");
  
  const Home = React.lazy(() => import("./pages/Home"));

  // const AuthExists = ({ children }) => {
  //   return token ? <Navigate to={"/"} /> : children;
  // };

  // const RequireAuth = ({ children }) => {
  //   return token ? children : <Navigate to={"/login"} />;
  // };

  const windowsSize = () => {
    const width = window.innerWidth;
    if (width <= 576) {
      return "xs";
    }
    if (width > 576 && width <= 768) {
      return "s";
    }
    if (width > 768 && width <= 1024) {
      return "m";
    }
    if (width > 1024 && width <= 1440) {
      return "l";
    }
    if (width > 1440) {
      return "xl";
    }
  };

  useEffect(() => {
    window.addEventListener("load", () => setWindowSize(windowsSize));
    window.addEventListener("resize", () => setWindowSize(windowsSize));

    return () => {
      window.removeEventListener("load", () => setWindowSize(windowsSize));
      window.removeEventListener("resize", () => setWindowSize(windowsSize));
    };
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
