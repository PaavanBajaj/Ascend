import { db, ADMIN_EMAIL } from "@/lib/instantdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, XCircle, Clock, Loader2, LogOut, User } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Admin() {
  const { user, isLoading: authLoading } = db.useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && (!user || user.email !== ADMIN_EMAIL)) {
      setLocation(user ? "/schedule" : "/");
    }
  }, [user, authLoading, setLocation]);

  const { data, isLoading } = db.useQuery({
    sessions: {},
  });

  const allSessions = data?.sessions || [];
  const pendingSessions = allSessions.filter((s) => s.status === "pending");
  const approvedSessions = allSessions.filter((s) => s.status === "approved");
  const deniedSessions = allSessions.filter((s) => s.status === "denied");

  const handleUpdateStatus = async (sessionId: string, newStatus: "approved" | "denied") => {
    try {
      await db.transact(
        db.tx.sessions[sessionId].update({
          status: newStatus,
        })
      );
      toast({
        title: newStatus === "approved" ? "Session Approved" : "Session Denied",
        description: `The session request has been ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update session status.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await db.auth.signOut();
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[96px]" />
      </div>

      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Ascend Academics
              </span>
            </h1>
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              data-testid="button-admin-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Session
                </span>{" "}
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Requests
                </span>
              </h2>
              <p className="text-muted-foreground">Manage tutoring session requests from students</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="bg-card/50 border-card-border text-center">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-yellow-500">{pendingSessions.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-card-border text-center">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-green-500">{approvedSessions.length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-card-border text-center">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-red-500">{deniedSessions.length}</p>
                  <p className="text-sm text-muted-foreground">Denied</p>
                </CardContent>
              </Card>
            </div>

            {isLoading ? (
              <Card className="bg-card/50 border-card-border">
                <CardContent className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : pendingSessions.length === 0 ? (
              <Card className="bg-card/50 border-card-border">
                <CardContent className="py-8 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending session requests.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  Pending Requests
                </h3>
                {pendingSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="bg-card/50 border-card-border"
                    data-testid={`card-admin-pending-${session.id}`}
                  >
                    <CardContent className="py-4 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{session.userEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.day} at {session.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(session.id, "approved")}
                          className="bg-green-600 hover:bg-green-700"
                          data-testid={`button-approve-${session.id}`}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(session.id, "denied")}
                          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                          data-testid={`button-deny-${session.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Deny
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {approvedSessions.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Approved Sessions
              </h3>
              <div className="grid gap-4">
                {approvedSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="bg-card/50 border-card-border"
                    data-testid={`card-admin-approved-${session.id}`}
                  >
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">{session.userEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.day} at {session.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-500 font-medium">Approved</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {deniedSessions.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Denied Sessions
              </h3>
              <div className="grid gap-4">
                {deniedSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="bg-card/50 border-card-border"
                    data-testid={`card-admin-denied-${session.id}`}
                  >
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">{session.userEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.day} at {session.time}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-red-500 font-medium">Denied</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
