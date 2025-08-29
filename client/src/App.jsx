import { useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import WarehouseSetupPage from "./pages/WarehouseSetupPage";
import RouteOptimizationPage from "./pages/RouteOptimizationPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/warehouse" element={<WarehouseSetupPage />} />
          <Route path="/optimize-routes" element={<RouteOptimizationPage />} />
          {/* Catch-all for unmatched routes */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
