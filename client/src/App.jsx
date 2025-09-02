import { useState } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import WarehouseSetupPage from "./pages/WarehouseSetupPage";
import RouteOptimizationPage from "./pages/RouteOptimizationPage";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/warehouse" element={<WarehouseSetupPage />} />
          <Route path="/optimize-routes" element={<RouteOptimizationPage />} />
        </Routes>
      </Router>
      <Toaster richColors/>
    </Provider>
  );
}

export default App;
