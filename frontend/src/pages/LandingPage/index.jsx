import { useEffect, useState } from "react";
import LoginPage from "../LoginPage";
import PrivacyPage from "./PrivacyPage";
import TermsAndConditions from "./TermsAndConditions";
import RefundPolicy from "./RefundPolicy";
import { testimonialImages } from "./data";
import LandingHeader from "./LandingHeader";
import HeroSection from "./HeroSection";
import FeaturesPricingSection from "./FeaturesPricingSection";
import ProductSection from "./ProductSection";
import TestimonialsSection from "./TestimonialsSection";
import StatsSection from "./StatsSection";
import FaqCtaSection from "./FaqCtaSection";
import FooterSection from "./FooterSection";

function App() {
  const [showEnquiry, setShowEnquiry] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const [, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => {
        return (prev + 1) % testimonialImages.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const [activeFeature, setActiveFeature] = useState(null);
  const scrollTo = (id) => {
    setMobileOpen(false);

    requestAnimationFrame(() => {
      const target = document.getElementById(id);

      if (!target) {
        return;
      }

      const headerOffset = 96;
      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  };
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateTo = (path) => {
    if (window.location.pathname === path) {
      return;
    }

    window.history.pushState({}, "", path);

    setCurrentPath(path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setMobileOpen(false);
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  const goToPrivacy = () => {
    navigateTo("/privacy-policy");
  };

  const goToTerms = () => {
    navigateTo("/terms-and-conditions");
  };

  const goToRefund = () => {
    navigateTo("/refund-policy");
  };

  const goToHome = () => {
    navigateTo("/");
  };
  if (currentPath === "/privacy-policy") {
    return <PrivacyPage onBack={goToHome} />;
  }

  if (currentPath === "/terms-and-conditions") {
    return <TermsAndConditions onBack={goToHome} />;
  }

  if (currentPath === "/refund-policy") {
    return <RefundPolicy onBack={goToHome} />;
  }

  if (currentPath === "/login") {
    return <LoginPage onBack={goToHome} />;
  }
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <LandingHeader
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        scrollTo={scrollTo}
        goToLogin={goToLogin}
        showEnquiry={showEnquiry}
        setShowEnquiry={setShowEnquiry}
      />
      <main>
        <HeroSection goToLogin={goToLogin} />
        <FeaturesPricingSection activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
        <ProductSection scrollTo={scrollTo} />
        <TestimonialsSection />
        <StatsSection />
        <FaqCtaSection faqOpen={faqOpen} setFaqOpen={setFaqOpen} goToLogin={goToLogin} />
      </main>
      <FooterSection
        scrollTo={scrollTo}
        goToPrivacy={goToPrivacy}
        goToTerms={goToTerms}
        goToRefund={goToRefund}
      />
    </div>
  );
}

export default App;
