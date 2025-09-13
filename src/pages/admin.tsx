import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";

const AdminPage = () => {
  // A simple state to track login status.
  // In a real app, you might use context or a more robust state management solution.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // In a real app, you would also call your Firebase sign-out function here.
    // For example: signOut(auth);
    setIsLoggedIn(false);
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (the home screen)
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} onBack={handleBack} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminPage;