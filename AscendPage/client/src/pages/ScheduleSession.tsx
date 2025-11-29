import { useState } from "react";
import { db, ADMIN_EMAIL } from "@/lib/instantdb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, CheckCircle, XCircle, Loader2, LogOut } from "lucide-react";
import { id } from "@instantdb/react";

const DAYS = ["Sunday", "Saturday", "Tuesday"] as const;
type Day = typeof DAYS[number];

const TIME_SLOTS: Record<Day, string[]> = {
  Sunday: ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
  Saturday: ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
  Tuesday: ["5:00 PM", "6:00 PM", "7:00 PM"],
};

export default function ScheduleSession() {
  const { user, isLoading: authLoading } = db.useAuth();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading } = db.useQuery(
    user?.email
      ? {
          sessions: {
            $: {
              where: {
                or: [
                  { userEmail: user.email },
                  { status: "approved" }
                ]
              },
            },
          },
        }
      : null
  );

  const userSessions = data?.sessions?.filter(s => s.userEmail === user.email) || [];
  const allApprovedSessions = data?.sessions?.filter(s => s.status === "approved") || [];
  const upcomingSessions = userSessions.filter((s) => s.status === "approved");
  const pendingSessions = userSessions.filter((s) => s.status === "pending");

  const handleSubmitRequest = async () => {
    if (!selectedDay || !selectedTime || !user?.email) return;

    setIsSubmitting(true);
    try {
      await db.transact(
        db.tx.sessions[id()].update({
          userEmail: user.email,
          day: selectedDay,
          time: selectedTime,
          status: "pending",
          createdAt: Date.now(),
        })
      );
      toast({
        title: "Request Submitted",
        description: `Your session request for ${selectedDay} at ${selectedTime} has been sent for approval.`,
      });
      setSelectedDay(null);
      setSelectedTime(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await db.auth.signOut();
  };

  if (authLoading || !user) {
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
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Ascend Academics
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              data-testid="button-logout"
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
                  Schedule a
                </span>{" "}
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Session
                </span>
              </h2>
              <p className="text-muted-foreground">Select a day and time for your next tutoring session</p>
            </div>

            <Card className="bg-card/50 border-card-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Select Day & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Available Days (Next Week)</p>
                  <div className="flex flex-wrap gap-3">
                    {DAYS.map((day) => (
                      <Button
                        key={day}
                        variant={selectedDay === day ? "default" : "outline"}
                        onClick={() => {
                          setSelectedDay(day);
                          setSelectedTime(null);
                        }}
                        className="toggle-elevate"
                        data-testid={`button-day-${day.toLowerCase()}`}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedDay && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Available Times for {selectedDay}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {TIME_SLOTS[selectedDay].map((time) => {
                        const isBooked = allApprovedSessions.some(
                          session => session.day === selectedDay && session.time === time
                        );
                        
                        return (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="toggle-elevate"
                            disabled={isBooked}
                            data-testid={`button-time-${time.replace(/[: ]/g, "-").toLowerCase()}`}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {time}
                            {isBooked && <XCircle className="w-4 h-4 ml-2 text-red-500" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedDay && selectedTime && (
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Selected Session</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedDay} at {selectedTime} (Next Week)
                        </p>
                      </div>
                      <Button 
                        onClick={handleSubmitRequest} 
                        disabled={isSubmitting}
                        data-testid="button-request-session"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Request Session
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {pendingSessions.length > 0 && (
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                Pending Requests
              </h3>
              <div className="grid gap-4">
                {pendingSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="bg-card/50 border-card-border"
                    data-testid={`card-pending-session-${session.id}`}
                  >
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                          <Clock className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-medium">{session.day} at {session.time}</p>
                          <p className="text-sm text-muted-foreground">Awaiting approval</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Upcoming Sessions
            </h3>
            {isLoading ? (
              <Card className="bg-card/50 border-card-border">
                <CardContent className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </CardContent>
              </Card>
            ) : upcomingSessions.length === 0 ? (
              <Card className="bg-card/50 border-card-border">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No upcoming sessions yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Schedule a session above to get started!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className="bg-card/50 border-card-border"
                    data-testid={`card-upcoming-session-${session.id}`}
                  >
                    <CardContent className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">{session.day} at {session.time}</p>
                          <p className="text-sm text-green-500">Approved</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
