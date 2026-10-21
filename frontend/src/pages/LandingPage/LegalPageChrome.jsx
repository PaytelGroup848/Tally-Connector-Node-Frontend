import { useState } from "react";
import LandingHeader from "./LandingHeader";
import FooterSection from "./FooterSection";

function navigateTo(path) {
  if (window.location.pathname === path) {
    return;
  }

  window.location.assign(path);
}

function scrollToLandingSection(id) {
  const scroll = () => {
    const target = document.getElementById(id);
    if (!target) {
      return false;
    }

    const top = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  if (!scroll()) {
    window.location.assign(`/#${encodeURIComponent(id)}`);
  }
}

export function LegalPageHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <LandingHeader
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      scrollTo={scrollToLandingSection}
      goToLogin={() => navigateTo("/login")}
      showEnquiry={showEnquiry}
      setShowEnquiry={setShowEnquiry}
    />
  );
}

export function LegalPageFooter() {
  return (
    <FooterSection
      scrollTo={scrollToLandingSection}
      goToPrivacy={() => navigateTo("/privacy-policy")}
      goToTerms={() => navigateTo("/terms-and-conditions")}
      goToRefund={() => navigateTo("/refund-policy")}
    />
  );
}
