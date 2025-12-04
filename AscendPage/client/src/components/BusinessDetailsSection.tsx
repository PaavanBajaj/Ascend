import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Target, 
  GraduationCap, 
  MessageSquare,
  Calculator,
  FlaskConical,
  Brain,
  MapPin,
  Monitor,
  DollarSign
} from "lucide-react";

export default function BusinessDetailsSection() {
  const services = [
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Custom study plans tailored to your unique learning style and goals.",
    },
    {
      icon: Users,
      title: "1-on-1 Sessions",
      description: "Dedicated one-on-one time with expert tutors for focused learning.",
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule, available 3 days a week.",
    },
    {
      icon: GraduationCap,
      title: "CogAT Test Prep",
      description: "Comprehensive preparation for CogAT assessments, grades 2-8.",
    },
    {
      icon: BookOpen,
      title: "Homework Help",
      description: "Get unstuck and understand concepts with guided assistance.",
    },
    {
      icon: MessageSquare,
      title: "Progress Reports",
      description: "Regular updates on your academic growth and achievements.",
    },
  ];

  const subjects = [
    { icon: Calculator, name: "Mathematics", levels: "Up to Precalculus" },
    { icon: FlaskConical, name: "Science", levels: "Biology, Chemistry (up to AP)" },
    { icon: Brain, name: "CogAT Test Prep", levels: "Grades 2-8" },
  ];

  const pricing = [
    { icon: MapPin, type: "In-Person Sessions", price: "$25", period: "per hour", description: "Face-to-face learning at tutor's location" },
    { icon: Monitor, type: "Online Sessions", price: "$20", period: "per hour", description: "Convenient virtual tutoring from anywhere" },
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Why Choose
            </span>{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Ascend Academics
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine expert instruction with innovative learning techniques to help you achieve academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((service, index) => (
            <Card 
              key={service.title} 
              className="bg-card/50 border-card-border hover-elevate group"
              data-testid={`card-service-${index}`}
            >
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Subjects We Cover</h3>
          <p className="text-muted-foreground">Expert tutoring in core academic areas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          {subjects.map((subject, index) => (
            <Card 
              key={subject.name}
              className="bg-card/50 border-card-border text-center hover-elevate"
              data-testid={`card-subject-${index}`}
            >
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <subject.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-1">{subject.name}</h4>
                <p className="text-sm text-muted-foreground">{subject.levels}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Simple
            </span>{" "}
            <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h3>
          <p className="text-muted-foreground">Affordable rates for quality education</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {pricing.map((item, index) => (
            <Card 
              key={item.type}
              className="bg-card/50 border-card-border hover-elevate overflow-visible"
              data-testid={`card-pricing-${index}`}
            >
              <CardContent className="pt-8 pb-6 text-center">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{item.type}</h4>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-primary">{item.price}</span>
                  <span className="text-muted-foreground">/{item.period.split(" ")[1]}</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
