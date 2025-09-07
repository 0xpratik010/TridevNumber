import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Clock, Star } from "lucide-react";

interface LuckyNumberDisplayProps {
  onViewPast: () => void;
}

// Mock data - replace with real API calls
const mockRevealTime = "14:00";
const mockTodayNumber = 777;

export const LuckyNumberDisplay = ({ onViewPast }: LuckyNumberDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Check if current time is past reveal time
    const now = new Date();
    const revealDateTime = new Date();
    const [hours, minutes] = mockRevealTime.split(':').map(Number);
    revealDateTime.setHours(hours, minutes, 0, 0);
    
    setIsRevealed(now >= revealDateTime);

    return () => clearInterval(timer);
  }, []);

  const handleReveal = () => {
    if (!isRevealed) return;
    // In real app: trigger reveal animation and API call
    console.log("Revealing today's lucky number:", mockTodayNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Star className="w-12 h-12 text-golden animate-pulse" />
              <Sparkles className="w-6 h-6 text-golden-light absolute -top-1 -right-1 animate-ping" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Daily Lucky Number</h1>
          <p className="text-muted-foreground">Your fortune awaits...</p>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant">
          <div className="p-8 text-center space-y-6">
            {!isRevealed ? (
              <>
                <div className="flex justify-center">
                  <Clock className="w-16 h-16 text-mystical animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">Not Yet Time!</h2>
                  <p className="text-muted-foreground">
                    Wait until <span className="text-golden font-bold">{mockRevealTime}</span> to see today's lucky number
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Current time:</p>
                  <p className="text-xl font-mono text-golden">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour12: false, 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="text-6xl font-bold text-golden bg-gradient-golden bg-clip-text text-transparent animate-pulse">
                      {mockTodayNumber}
                    </div>
                    <div className="absolute inset-0 bg-golden/20 blur-xl rounded-full"></div>
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Today's Lucky Number!</h2>
                  <p className="text-muted-foreground">May fortune smile upon you today</p>
                </div>
              </>
            )}

            <Button
              onClick={handleReveal}
              disabled={!isRevealed}
              variant={isRevealed ? "default" : "secondary"}
              size="lg"
              className="w-full bg-gradient-golden hover:shadow-golden transition-all duration-300 text-primary-foreground font-semibold"
            >
              {isRevealed ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Reveal Today's Number
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-5 w-5" />
                  Wait for {mockRevealTime}
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* View Past Numbers Button */}
        <Button
          onClick={onViewPast}
          variant="outline"
          size="lg"
          className="w-full border-golden/30 hover:bg-golden/10 hover:border-golden/50 text-foreground"
        >
          View Past Numbers
        </Button>
      </div>
    </div>
  );
};