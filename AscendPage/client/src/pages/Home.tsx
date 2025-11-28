import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BusinessDetailsSection from "@/components/BusinessDetailsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <BusinessDetailsSection />
      </main>
      <Footer />
    </div>
  );
}
