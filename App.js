import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SimpleLogin from "./components/SimpleLogin";
import EtudiantPage from "./components/Etudiant";
import EnseignantPage from "./components/Enseignant";
import AdminPage from "./components/AdminPage";
import Home from "./components/Home";
import CreateAccount from "./components/RegisterPage";
import Navbar from "./components/Navbar";

// Route privée avec contrôle du rôle
const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;

  return children;
};

const App = () => {
  return (
    <div className="app-wrapper">
      <Router>
        <Navbar />
        <div className="main-content" style={{ minHeight: '120vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SimpleLogin />} />
            <Route path="/create-account" element={<CreateAccount />} />

            <Route
              path="/etudiant"
              element={
                <PrivateRoute allowedRole="etudiant">
                  <EtudiantPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/enseignant"
              element={
                <PrivateRoute allowedRole="enseignant">
                  <EnseignantPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRole="admin">
                  <AdminPage />
                </PrivateRoute>
              }
            />

            {/* Route de secours pour les URL non trouvées */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
