import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import HowItWorks from "@/components/landing/HowItWorks";
import Categories from "@/components/landing/Categories";
import Security from "@/components/landing/Security";
import ApiSection from "@/components/landing/ApiSection";
import Pricing from "@/components/landing/Pricing";
import WaitlistSection from "@/components/landing/WaitlistSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Categories />
        <Security />
        <ApiSection />
        <Pricing />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
