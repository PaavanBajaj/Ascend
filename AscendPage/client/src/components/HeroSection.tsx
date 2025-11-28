import { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/instantdb";
import AuthModal from "./AuthModal";
import { ArrowRight, Zap, TrendingUp, Award } from "lucide-react";

export default function HeroSection() {
  const { user } = db.useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const openSignup = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[96px]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Unlock Your Potential</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Elevate Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
                Academic Journey
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Personalized tutoring that adapts to your unique learning style. 
              Expert educators dedicated to helping you reach new heights in your studies.
            </p>

            {!user && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={openSignup}
                  className="text-lg px-8 py-6 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                  data-testid="button-hero-signup"
                >
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={openLogin}
                  className="text-lg px-8 py-6"
                  data-testid="button-hero-login"
                >
                  Already a Member?
                </Button>
              </div>
            )}

            {user && (
              <div className="inline-flex items-center gap-3 px-6 py-4 bg-primary/10 border border-primary/20 rounded-2xl">
                <Award className="w-6 h-6 text-primary" />
                <span className="text-lg">Welcome back! Ready to continue your journey?</span>
              </div>
            )}

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Award, label: "Expert Tutors", value: "3" },
                { icon: TrendingUp, label: "Success Rate", value: "98%" },
                { icon: Zap, label: "Core Subjects", value: "3" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center p-6 bg-card/50 border border-card-border rounded-xl hover-elevate"
                  data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}
                >
                  <stat.icon className="w-8 h-8 text-primary mb-3" />
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
