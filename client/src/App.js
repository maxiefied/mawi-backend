// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import PowerChart from "./components/PowerChart";
import Login from "./pages/login";
import ControlPage from "./pages/ControlPage";
import PaymentsPage from "./pages/PaymentsPage"; // ✅ Import PaymentsPage
import BuyTokensPage from './pages/BuyTokensPage';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("mawi-token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  return (
    <Router>
      <div className="App">
        <h1>MAWI Solutions Dashboard</h1>

        {!token ? (
          <Login onLogin={handleLogin} />
        ) : (
          <div>
            <nav style={{ marginBottom: "20px" }}>
              <Link to="/" style={{ marginRight: "10px" }}>Live Chart</Link>
              <Link to="/control" style={{ marginRight: "10px" }}>Controls</Link>
              <Link to="/payments">Payments</Link> {/* ✅ Add link */}
              <Link to="/buy" style={{ marginRight: "10px" }}>Buy Tokens</Link>
            </nav>

            <Routes>
              <Route path="/" element={<PowerChart />} />
              <Route path="/control" element={<ControlPage />} />
              <Route path="/payments" element={<PaymentsPage />} /> {/* ✅ Add route */}
              <Route path="/buy" element={<BuyTokensPage />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;