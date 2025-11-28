import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { db, ADMIN_EMAIL } from "@/lib/instantdb";
import Home from "@/pages/Home";
import ScheduleSession from "@/pages/ScheduleSession";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function AuthRedirect() {
  const { user, isLoading } = db.useAuth();
  const [location] = useLocation();

  if (user && location === "/") {
    if (user.email === ADMIN_EMAIL) {
      return <Redirect to="/admin" />;
    }
    return <Redirect to="/schedule" />;
  }

  if (!isLoading && !user && (location === "/schedule" || location === "/admin")) {
    return <Redirect to="/" />;
  }

  return null;
}

function Router() {
  return (
    <>
      <AuthRedirect />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/schedule" component={ScheduleSession} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
