import { useState } from "react";
import { db } from "@/lib/instantdb";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { LogOut, Sparkles } from "lucide-react";

export default function Header() {
  const { isLoading, user } = db.useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openLogin = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleSignOut = () => {
    db.auth.signOut();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" data-testid="logo">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Ascend Academics
            </span>
          </div>

          <nav className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground" data-testid="text-user-email">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  data-testid="button-signout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={openLogin}
                  data-testid="button-header-login"
                >
                  Login
                </Button>
                <Button
                  onClick={openSignup}
                  data-testid="button-header-signup"
                >
                  Sign Up
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
