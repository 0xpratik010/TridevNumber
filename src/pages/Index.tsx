import { useState } from "react";
import { LuckyNumberDisplay } from "@/components/LuckyNumberDisplay";
import { PastNumbers } from "@/components/PastNumbers";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

type View = "home" | "past" | "admin-login" | "admin-dashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView("home");
  };

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <LuckyNumberDisplay onViewPast={() => setCurrentView("past")} />;
      case "past":
        return <PastNumbers onBack={() => setCurrentView("home")} />;
      case "admin-login":
        return <AdminLogin onLogin={handleAdminLogin} />;
      case "admin-dashboard":
        return <AdminDashboard onLogout={handleAdminLogout} />;
      default:
        return <LuckyNumberDisplay onViewPast={() => setCurrentView("past")} />;
    }
  };

  return (
    <div className="relative">
      {/* Admin Access Button - Only show on home and past views */}
      {(currentView === "home" || currentView === "past") && (
        <Button
          onClick={() => setCurrentView("admin-login")}
          variant="ghost"
          size="sm"
          className="fixed top-4 right-4 z-50 text-muted-foreground hover:text-golden transition-colors"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
      
      {renderView()}
    </div>
  );
};

export default Index;
