import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Ascend Academics
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Empowering students to reach their full potential through personalized education.
          </p>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Ascend Academics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
