import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import HomePage from "./pages/HomePage";
import QuestionDetail from "./pages/QuestionDetail";
import AskQuestion from "./pages/AskQuestion";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
// import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/question/:id" element={<QuestionDetail />} />
                <Route path="/ask" element={<AskQuestion />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                {/* <Route path="/admin" element={<AdminPanel />} /> */}
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
