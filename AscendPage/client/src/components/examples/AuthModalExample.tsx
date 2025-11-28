import { useState } from "react";
import AuthModal from "../AuthModal";
import { Button } from "@/components/ui/button";

export default function AuthModalExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("signup");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center gap-4">
      <Button onClick={() => { setMode("login"); setIsOpen(true); }}>
        Open Login
      </Button>
      <Button onClick={() => { setMode("signup"); setIsOpen(true); }}>
        Open Signup
      </Button>
      <AuthModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        initialMode={mode}
      />
    </div>
  );
}
