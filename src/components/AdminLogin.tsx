import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authenticateAdmin } from "@/lib/api";

interface AdminLoginProps {
  onBack: () => void;
  onLogin: () => void;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 10;


export const AdminLogin = ({ onLogin, onBack }: AdminLoginProps) => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- RATE LIMIT CHECK ---
    const now = Date.now();
    const windowMs = WINDOW_MINUTES * 60 * 1000;

    // Load previous attempts from localStorage
    const attempts = JSON.parse(localStorage.getItem("adminLoginAttempts") || "[]");

    // Filter out attempts older than 10 minutes
    const recentAttempts = attempts.filter((t: number) => now - t < windowMs);

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      toast({
        title: "Too Many Attempts",
        description: `You have reached the limit of ${MAX_ATTEMPTS} attempts in ${WINDOW_MINUTES} minutes. Please try again later.`,
        variant: "destructive",
      });
      return;
    }

    // Add current attempt timestamp & save back
    recentAttempts.push(now);
    localStorage.setItem("adminLoginAttempts", JSON.stringify(recentAttempts));

    // --- PROCEED WITH LOGIN ---
    setIsLoading(true);

    try {
      const isAuthenticated = await authenticateAdmin(email, password);
      if (isAuthenticated) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });
        localStorage.removeItem("adminLoginAttempts"); // reset attempts on success
        onLogin();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* <Button
            onClick={onBack}
            variant="outline"
            className="border-golden/30 hover:bg-golden/10 hover:border-golden/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button> */}
      <Card className="relative w-full max-w-md bg-gradient-card border-border/50 backdrop-blur-sm shadow-elegant">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:bg-muted/50 z-10"
          onClick={onBack}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Shield className="w-12 h-12 text-mystical" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="text-muted-foreground">Enter your credentials to continue</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/30 border-border/50 text-foreground"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/30 border-border/50 text-foreground pr-10"
                  placeholder="Enter password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-mystical hover:shadow-mystical transition-all duration-300 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Credentials */}
          {/*<div className="text-center">
            <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
              <p className="font-medium text-golden mb-1">Demo Credentials:</p>
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
          </div>*/}
        </div>
      </Card>
    </div>
  );
};