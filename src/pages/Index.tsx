import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuckyNumberDisplay } from "@/components/LuckyNumberDisplay";
import { PastNumbers } from "@/components/PastNumbers";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

type View = "home" | "past";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("home");
  const navigate = useNavigate();

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <LuckyNumberDisplay onViewPast={() => setCurrentView("past")} />;
      case "past":
        return <PastNumbers onBack={() => setCurrentView("home")} />;
      default:
        return <LuckyNumberDisplay onViewPast={() => setCurrentView("past")} />;
    }
  };

  return (
    <div className="relative">
      {/* Admin Access Button - Only show on home and past views */}
      {(currentView === "home" || currentView === "past") 
      // && (
      //   <Button
      //     onClick={() => navigate("/admin")}
      //     variant="ghost"
      //     size="sm"
      //     className="fixed top-4 right-4 z-50 text-muted-foreground hover:text-golden transition-colors"
      //   >
      //     <Settings className="h-4 w-4" />
      //   </Button>
      // )
      }
      
      {renderView()}
    </div>
  );
};

export default Index;
