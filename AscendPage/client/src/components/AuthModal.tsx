import { useState, useRef, useEffect } from "react";
import { db } from "@/lib/instantdb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, Mail, User, Key, CheckCircle, Loader2 } from "lucide-react";

type AuthMode = "login" | "signup";
type SignupStep = 1 | 2 | 3 | 4;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSignupStep(1);
      setEmail("");
      setAge("");
      setCode("");
      setError("");
      setCodeSent(false);
      setIsLoading(false);
    }
  }, [isOpen, initialMode]);

  const resetState = () => {
    setEmail("");
    setAge("");
    setCode("");
    setError("");
    setSignupStep(1);
    setCodeSent(false);
    setIsLoading(false);
  };

  const switchMode = (newMode: AuthMode) => {
    resetState();
    setMode(newMode);
  };

  const checkUserExists = async (emailToCheck: string): Promise<boolean> => {
    try {
      const result = await db.queryOnce({
        users: {
          $: {
            where: {
              email: emailToCheck,
            },
          },
        },
      });
      return result.data.users && result.data.users.length > 0;
    } catch {
      return false;
    }
  };

  const handleSendCode = async (skipUserCheck = false) => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setIsLoading(true);
    setError("");
    
    try {
      if (mode === "login" && !skipUserCheck) {
        const userExists = await checkUserExists(email);
        if (!userExists) {
          setIsLoading(false);
          setError("No account found with this email. Please sign up first.");
          return;
        }
      }
      
      await db.auth.sendMagicCode({ email });
      setCodeSent(true);
      if (mode === "signup") {
        setSignupStep(4);
      }
    } catch (err: any) {
      setError(err.body?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError("Please enter the verification code");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await db.auth.signInWithMagicCode({ email, code });
      if (mode === "signup" && age) {
        const user = await db.getAuth();
        if (user && user.email) {
          db.transact(
            db.tx.users[user.id].update({
              email: user.email,
              age: parseInt(age),
            })
          );
        }
      }
      resetState();
      onClose();
    } catch (err: any) {
      setError(err.body?.message || "Invalid code");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupNext = () => {
    if (signupStep === 1) {
      if (!email) {
        setError("Please enter your email");
        return;
      }
      setError("");
      setSignupStep(2);
    } else if (signupStep === 2) {
      if (!age || parseInt(age) < 5 || parseInt(age) > 120) {
        setError("Please enter a valid age (5-120)");
        return;
      }
      setError("");
      setSignupStep(3);
    } else if (signupStep === 3) {
      handleSendCode();
    }
  };

  const handleSignupBack = () => {
    setError("");
    if (signupStep > 1) {
      setSignupStep((signupStep - 1) as SignupStep);
    }
  };

  const stepLabels = ["Email", "Age", "Send Code", "Verify"];

  const renderSignupProgress = () => (
    <div className="flex items-center justify-between mb-8" data-testid="signup-progress">
      {stepLabels.map((label, index) => {
        const step = index + 1;
        const isActive = step === signupStep;
        const isComplete = step < signupStep;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isComplete
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isComplete ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              <span className="text-xs mt-1 text-muted-foreground">{label}</span>
            </div>
            {index < stepLabels.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  isComplete ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSignupStep = () => {
    switch (signupStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-sm uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  ref={emailInputRef}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  data-testid="input-signup-email"
                  autoFocus
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-age" className="text-sm uppercase tracking-wider text-muted-foreground">
                Your Age
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={5}
                  max={120}
                  className="pl-10"
                  data-testid="input-signup-age"
                  autoFocus
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                We'll send a verification code to <strong className="text-foreground">{email}</strong>
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-code" className="text-sm uppercase tracking-wider text-muted-foreground">
                Verification Code
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="signup-code"
                  ref={codeInputRef}
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                  data-testid="input-signup-code"
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Check your email for the verification code
              </p>
            </div>
          </div>
        );
    }
  };

  const renderLoginForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-sm uppercase tracking-wider text-muted-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            data-testid="input-login-email"
            autoFocus
          />
        </div>
      </div>
      {codeSent && (
        <div className="space-y-2">
          <Label htmlFor="login-code" className="text-sm uppercase tracking-wider text-muted-foreground">
            Verification Code
          </Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="login-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="pl-10"
              data-testid="input-login-code"
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-primary/20 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Welcome Back" : "Join Ascend Academics"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {mode === "signup" && renderSignupProgress()}

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm" data-testid="text-auth-error">
              {error}
            </div>
          )}

          {mode === "signup" ? renderSignupStep() : renderLoginForm()}

          <div className="mt-6 space-y-3">
            {mode === "signup" ? (
              <div className="flex gap-3">
                {signupStep > 1 && signupStep < 4 && (
                  <Button
                    variant="outline"
                    onClick={handleSignupBack}
                    className="flex-1"
                    data-testid="button-signup-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {signupStep < 4 ? (
                  <Button
                    onClick={handleSignupNext}
                    className="flex-1"
                    disabled={isLoading}
                    data-testid="button-signup-next"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : signupStep === 3 ? (
                      "Send Code"
                    ) : (
                      "Continue"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleVerifyCode}
                    className="flex-1"
                    disabled={isLoading}
                    data-testid="button-signup-verify"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify & Sign Up"
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <Button
                onClick={codeSent ? handleVerifyCode : () => handleSendCode()}
                className="w-full"
                disabled={isLoading}
                data-testid="button-login-submit"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : codeSent ? (
                  "Login"
                ) : (
                  "Send Login Code"
                )}
              </Button>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-primary hover:underline font-medium"
                  data-testid="link-switch-to-signup"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-primary hover:underline font-medium"
                  data-testid="link-switch-to-login"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
