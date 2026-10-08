import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Phone, ArrowRight, Download, Menu, X } from "lucide-react";
import logoFull from "../assets/Control-Books-Dashboard.png";
import EnquiryModal from "../components/EnquiryModal";

export default function HeaderLandingPage() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showEnquiry, setShowEnquiry] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isLandingPage =
        location.pathname === "/" || location.pathname === "/home";

    const goToSection = (id) => {
        if (isLandingPage) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(`/#${id}`);
        }
        setMobileOpen(false);
    };

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <button
                   onClick={() => {
                            window.location.href = "/";
                        }}
                    className="flex items-center gap-2"
                >
                    <img
                        src={logoFull}
                        alt="CtrlBooks Logo"
                        className="h-18 sm:h-14 w-auto object-contain"
                    />
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 lg:flex">
                    <div className="flex items-center gap-1">
                        <Phone size={16} strokeWidth={2} />
                        <div className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700">
                            +91 9311472357
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
                    >
                        Home
                    </button>
                    <button
                       onClick={() => {
                            window.location.href = "/";
                        }}
                        className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
                    >
                        Features
                    </button>

                    <button
                       onClick={() => {
                            window.location.href = "/";
                        }}
                        className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
                    >
                        Pricing
                    </button>

                    <button
                        onClick={() => {
                            window.location.href = "/";
                        }}
                        className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
                    >
                        Testimonials
                    </button>

                    <button
                       onClick={() => {
                            window.location.href = "/";
                        }}
                        className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
                    >
                        FAQ
                    </button>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 lg:flex">
                    {/* Start using CtrlBooks */}
                    <button
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-green-100 transition hover:bg-emerald-800 mr-8"
                    >
                        Start using CtrlBooks
                        <ArrowRight
                            size={18}
                            className="transition group-hover:translate-x-1"
                        />
                    </button>

                    {/* Download Connector + Enquiry */}
                    <div className="mt-23 flex w-[190px] flex-col items-center">
                        {/* Download Connector */}
                        <a
                            href="http://191.44.87.205:8000/downloads/CtrlBooks_Setup_v1.0.2.exe"
                            download
                            title="Download CtrlBooks Connector"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-emerald-800"
                        >
                            <span className="whitespace-nowrap">Download Connector</span>
                            <Download size={18} strokeWidth={2.2} className="shrink-0" />
                        </a>

                        {/* Enquiry Now (Desktop) */}
                        <div className="relative flex h-[95px] w-[140px] items-start justify-center">
                            {/* Chain */}
                            <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 flex-col items-center">
                                <div className="h-3 w-[3px] bg-[#8b5a18]" />
                                <div className="flex flex-col items-center">
                                    <span className="h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
                                    <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
                                    <span className="-mt-1 h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
                                    <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
                                </div>
                                <div className="mt-1 h-4 w-4 rounded-full border border-gray-400 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 shadow-md" />
                            </div>

                            {/* Yellow Tag */}
                            <div className="relative mt-12 w-[125px] rotate-[-14deg] rounded-[10px] border border-[#d69b08] bg-gradient-to-br from-[#fff06a] via-[#ffd83d] to-[#f5bd00] px-3 py-2 shadow-[0_5px_12px_rgba(0,0,0,0.18)]">
                                {/* Screw holes */}
                                <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                                <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                                <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />

                                <div className="text-center font-serif text-[13px] font-black leading-tight tracking-[0.08em] text-black">
                                    <button
                                        onClick={() => setShowEnquiry(true)}
                                        className="focus:outline-none"
                                    >
                                        ENQUIRY NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 lg:hidden">
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => {
                            window.location.href = "/login";
                        }}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-1 py-1 text-xs font-bold text-white shadow-xl shadow-green-100 transition hover:bg-emerald-800 mr-1"
                        >
                            Start using CtrlBooks
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((value) => !value)}
                        aria-label={
                            mobileOpen ? "Close navigation menu" : "Open navigation menu"
                        }
                        aria-expanded={mobileOpen}
                        className="flex h-10 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Enquiry Now (Mobile) */}
            <div className="left-3/4 absolute flex h-[95px] w-[20%] items-start justify-center lg:hidden">
                {/* Chain */}
                <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 flex-col items-center">
                    <div className="h-3 w-[3px] bg-[#8b5a18]" />
                    <div className="flex flex-col items-center">
                        <span className="h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
                        <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
                        <span className="-mt-1 h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
                        <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
                    </div>
                    <div className="mt-1 h-4 w-4 rounded-full border border-gray-400 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 shadow-md" />
                </div>

                {/* Yellow Tag */}
                <div className="relative mt-12 w-[125px] rotate-[-14deg] rounded-[10px] border border-[#d69b08] bg-gradient-to-br from-[#fff06a] via-[#ffd83d] to-[#f5bd00] px-3 py-2 shadow-[0_5px_12px_rgba(0,0,0,0.18)]">
                    {/* Screw holes */}
                    <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                    <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                    <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />

                    <div className="text-center font-serif text-[13px] font-black leading-tight tracking-[0.08em] text-black">
                        <button
                            onClick={() => setShowEnquiry(true)}
                            className="focus:outline-none"
                        >
                            ENQUIRY NOW
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileOpen && (
                <div className="border-t border-slate-100 bg-white px-4 py-5 lg:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-2">
                        {[
                            ["Home", "home"],
                            ["Features", "features"],
                            ["Pricing", "pricing"],
                            ["Testimonials", "testimonials"],
                            ["FAQ", "faq"],
                        ].map(([label, id]) => (
                            <button
                                key={id}
                                onClick={() => goToSection(id)}
                                className="rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Enquiry Modal */}
            <EnquiryModal
                isOpen={showEnquiry}
                onClose={() => setShowEnquiry(false)}
            />
        </header>
    );
}