import React, { useState, useEffect, useRef } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Check,
  ArrowRight,
  Star,
  Plus,
  Minus,
  User,
  Calendar as CalendarIcon,
  MapPin,
  BarChart3,
  Mail,
  Lock,
  ShieldAlert,
  Award,
  FileText,
  CheckCircle2,
  Info,
  HelpCircle,
  Layers,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Send,
  LogOut,
  LayoutDashboard,
  DollarSign,
  Users,
  Briefcase,
  RefreshCw,
  XCircle,
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  Play,
} from "lucide-react";

export default function DesignSystemShowcase() {
  // Theme Management
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // State Management for Interactive Components
  const [activeTab, setActiveTab] = useState<
    "landing" | "dashboard" | "auth" | "ui"
  >("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Modals and Toasts
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{
      id: number;
      type: "success" | "warning" | "error" | "info";
      message: string;
    }>
  >([]);

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Tabs Component state
  const [uiTab, setUiTab] = useState<"tab1" | "tab2" | "tab3">("tab1");

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<number | null>(17);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

  // Profile details
  const triggerToast = (
    type: "success" | "warning" | "error" | "info",
    message: string,
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <div
      className={`min-h-screen bg-theme-bg-sec text-theme-text transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}
    >
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg flex items-start gap-3 border animate-bounce-short bg-theme-surface ${
              toast.type === "success"
                ? "border-theme-success/40 text-theme-success"
                : toast.type === "warning"
                  ? "border-theme-warning/40 text-theme-warning"
                  : toast.type === "error"
                    ? "border-theme-error/40 text-theme-error"
                    : "border-theme-info/40 text-theme-info"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            {toast.type === "warning" && (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            {toast.type === "error" && <XCircle className="w-5 h-5 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 shrink-0" />}
            <div className="flex-1 text-sm font-medium text-theme-text">
              {toast.message}
            </div>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              className="text-theme-text-muted hover:text-theme-text"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Container / Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-theme-border-light bg-theme-surface/95 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white shadow-md shadow-theme-primary/20">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-theme-text">
              AURA<span className="text-theme-primary">.</span>
            </span>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab("landing");
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "landing"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg"
              }`}
            >
              Landing
            </button>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "dashboard"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab("auth");
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "auth"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg"
              }`}
            >
              Auth Forms
            </button>
            <button
              onClick={() => {
                setActiveTab("ui");
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "ui"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg"
              }`}
            >
              UI Showcase
            </button>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block relative max-w-xs w-full">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchFocused ? "text-theme-primary" : "text-theme-text-muted"}`}
            />
            <input
              type="search"
              placeholder="Quick search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/20 text-theme-text transition-all"
            />
          </div>

          {/* Utilities: Notifications, Theme Toggle, Profile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-theme-border-light bg-theme-surface hover:bg-theme-bg-sec text-theme-text-sec hover:text-theme-text shadow-sm transition-all"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationDropdownOpen(!notificationDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="p-2 rounded-xl border border-theme-border-light bg-theme-surface hover:bg-theme-bg-sec text-theme-text-sec hover:text-theme-text shadow-sm relative transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-theme-error" />
              </button>

              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-theme-surface border border-theme-border-light rounded-2xl shadow-xl py-2 z-50 animate-fade-in-down">
                  <div className="px-4 py-2 border-b border-theme-border-light flex justify-between items-center">
                    <span className="font-bold text-sm text-theme-text">
                      Notifications
                    </span>
                    <span className="text-[10px] font-semibold text-theme-primary bg-theme-primary-light px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-theme-bg-sec border-b border-theme-border-light cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-theme-primary-light text-theme-primary flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-theme-text">
                          System update complete
                        </p>
                        <p className="text-[10px] text-theme-text-muted mt-0.5">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-theme-bg-sec border-b border-theme-border-light cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-theme-secondary/15 text-theme-secondary flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-theme-text">
                          New testimonial approved
                        </p>
                        <p className="text-[10px] text-theme-text-muted mt-0.5">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pt-2 text-center">
                    <button className="text-xs font-bold text-theme-primary hover:underline">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 p-1 pr-2.5 rounded-xl border border-theme-border-light bg-theme-surface hover:bg-theme-bg-sec shadow-sm transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-theme-primary text-white flex items-center justify-center font-bold text-sm">
                  JD
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-theme-text-muted" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-theme-surface border border-theme-border-light rounded-2xl shadow-xl py-2 z-50 animate-fade-in-down">
                  <div className="px-4 py-2 border-b border-theme-border-light">
                    <p className="text-xs font-bold text-theme-text">
                      John Doe
                    </p>
                    <p className="text-[10px] text-theme-text-muted">
                      john.doe@aura.com
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("dashboard");
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-theme-text-sec hover:bg-theme-bg-sec flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-theme-text-sec hover:bg-theme-bg-sec flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5" /> Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      triggerToast("info", "Successfully logged out");
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-theme-error hover:bg-theme-bg-sec flex items-center gap-2 border-t border-theme-border-light mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger Button - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl border border-theme-border-light bg-theme-surface text-theme-text-sec hover:text-theme-text"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-theme-border-light bg-theme-surface py-3 px-4 flex flex-col gap-2 shadow-inner">
            <button
              onClick={() => {
                setActiveTab("landing");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl ${
                activeTab === "landing"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg-sec"
              }`}
            >
              Landing Page
            </button>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl ${
                activeTab === "dashboard"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg-sec"
              }`}
            >
              Dashboard & Stats
            </button>
            <button
              onClick={() => {
                setActiveTab("auth");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl ${
                activeTab === "auth"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg-sec"
              }`}
            >
              Auth & Forms
            </button>
            <button
              onClick={() => {
                setActiveTab("ui");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-semibold rounded-xl ${
                activeTab === "ui"
                  ? "bg-theme-primary-light text-theme-primary"
                  : "text-theme-text-sec hover:bg-theme-bg-sec"
              }`}
            >
              UI Components
            </button>
          </div>
        )}
      </header>

      {/* Main Viewport Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
        {/* ==================================== CATEGORY 1: LANDING & HERO ==================================== */}
        {activeTab === "landing" && (
          <div className="flex flex-col gap-20">
            {/* HERO SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-theme-primary bg-theme-primary-light rounded-full w-fit">
                  <Award className="w-3.5 h-3.5" /> High Performance Design
                  System
                </div>
                <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-theme-text leading-tight">
                  Design beautiful{" "}
                  <span className="text-theme-primary">Light & Dark</span>{" "}
                  interfaces.
                </h1>
                <p className="text-base text-theme-text-sec max-w-xl font-medium leading-relaxed">
                  A premium component ecosystem compliant with WCAG AA
                  accessibility standards. Clean markup, high contrast, and
                  smooth transitions built directly into the core framework.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button
                    onClick={() => setActiveTab("ui")}
                    className="px-6 py-3.5 bg-theme-primary hover:bg-theme-primary-hover text-white font-bold rounded-xl shadow-lg shadow-theme-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Explore Components <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3.5 bg-theme-surface hover:bg-theme-bg-sec border border-theme-border-med text-theme-text font-bold rounded-xl shadow-sm hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4" /> Watch Demo Video
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-8">
                  <p className="text-xs font-bold text-theme-text-muted uppercase tracking-widest">
                    TRUSTED BY LEADING TEAMS
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-4 opacity-75">
                    {["Figma", "Stripe", "Airbnb", "Vercel"].map((brand) => (
                      <span
                        key={brand}
                        className="font-bold text-sm tracking-wide text-theme-text-muted hover:text-theme-text transition-colors"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Illustration / Visual Card */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/10 to-theme-accent/15 filter blur-3xl rounded-full" />
                <div className="glass-panel w-full p-8 rounded-3xl border border-theme-border-light bg-theme-surface/75 shadow-xl hover:translate-y-[-4px] transition-all relative z-10">
                  <div className="flex items-center justify-between border-b border-theme-border-light pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-theme-error" />
                      <div className="w-3 h-3 rounded-full bg-theme-warning" />
                      <div className="w-3 h-3 rounded-full bg-theme-success" />
                    </div>
                    <span className="text-[10px] font-mono text-theme-text-muted">
                      AuraEngine v2.0.1
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-theme-bg-sec rounded-2xl border border-theme-border-light flex justify-between items-center">
                      <div>
                        <p className="text-xs text-theme-text-muted font-bold uppercase">
                          MONTHLY SALES
                        </p>
                        <p className="text-2xl font-extrabold text-theme-text mt-1">
                          $48,290
                        </p>
                      </div>
                      <div className="p-2.5 bg-theme-success/15 text-theme-success rounded-xl">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="p-4 bg-theme-bg-sec rounded-2xl border border-theme-border-light flex justify-between items-center">
                      <div>
                        <p className="text-xs text-theme-text-muted font-bold uppercase">
                          ACTIVE SUBSCRIPTIONS
                        </p>
                        <p className="text-2xl font-extrabold text-theme-text mt-1">
                          1,489
                        </p>
                      </div>
                      <div className="p-2.5 bg-theme-primary-light text-theme-primary rounded-xl">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PRICING CARDS */}
            <section className="flex flex-col gap-10">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-theme-primary bg-theme-primary-light px-3 py-1 rounded-full uppercase tracking-wider">
                  Simple Pricing
                </span>
                <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-theme-text mt-4">
                  Transparent plans for all teams
                </h2>
                <p className="text-sm text-theme-text-sec mt-2 font-medium">
                  Choose a configuration that fits your platform scope.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="glass-panel p-8 rounded-3xl border border-theme-border-light bg-theme-surface shadow-md hover:shadow-lg transition-all flex flex-col">
                  <span className="text-xs font-bold text-theme-text-muted uppercase">
                    Developer
                  </span>
                  <h3 className="text-2xl font-extrabold text-theme-text mt-2">
                    Free
                  </h3>
                  <p className="text-xs text-theme-text-sec mt-1">
                    Ideal for side projects & portfolios.
                  </p>
                  <div className="my-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-theme-text">
                      $0
                    </span>
                    <span className="text-xs text-theme-text-muted font-bold">
                      / forever
                    </span>
                  </div>
                  <ul className="flex flex-col gap-3 text-xs font-medium text-theme-text-sec mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      Core components
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      Light/Dark toggle
                    </li>
                    <li className="flex items-center gap-2 text-theme-text-disabled">
                      <Check className="w-4 h-4 shrink-0" /> Premium Dashboard
                      widgets
                    </li>
                  </ul>
                  <button
                    onClick={() =>
                      triggerToast("success", "Developer plan initialized")
                    }
                    className="mt-auto w-full py-3 bg-theme-bg-sec border border-theme-border-med hover:bg-theme-border-light text-theme-text font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>

                {/* Pro Plan (Featured) */}
                <div className="glass-panel p-8 rounded-3xl border-2 border-theme-primary bg-theme-surface shadow-xl relative flex flex-col hover:translate-y-[-4px] transition-all">
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-theme-primary text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                  <span className="text-xs font-bold text-theme-primary uppercase">
                    Startup Professional
                  </span>
                  <h3 className="text-2xl font-extrabold text-theme-text mt-2">
                    Pro Team
                  </h3>
                  <p className="text-xs text-theme-text-sec mt-1">
                    Complete system for production SaaS web applications.
                  </p>
                  <div className="my-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-theme-text">
                      $49
                    </span>
                    <span className="text-xs text-theme-text-muted font-bold">
                      / month
                    </span>
                  </div>
                  <ul className="flex flex-col gap-3 text-xs font-medium text-theme-text-sec mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      All 31+ Design System components
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      Figma UI resource toolkit
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      Premium priority Slack support
                    </li>
                  </ul>
                  <button
                    onClick={() =>
                      triggerToast("success", "Subscribed to Pro Team plan")
                    }
                    className="mt-auto w-full py-3 bg-theme-primary hover:bg-theme-primary-hover text-white font-bold rounded-xl shadow-md shadow-theme-primary/20 transition-colors cursor-pointer"
                  >
                    Subscribe Now
                  </button>
                </div>

                {/* Enterprise */}
                <div className="glass-panel p-8 rounded-3xl border border-theme-border-light bg-theme-surface shadow-md hover:shadow-lg transition-all flex flex-col">
                  <span className="text-xs font-bold text-theme-text-muted uppercase">
                    Enterprise
                  </span>
                  <h3 className="text-2xl font-extrabold text-theme-text mt-2">
                    Enterprise
                  </h3>
                  <p className="text-xs text-theme-text-sec mt-1">
                    For scale-ups requiring advanced support & compliance.
                  </p>
                  <div className="my-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-theme-text">
                      $199
                    </span>
                    <span className="text-xs text-theme-text-muted font-bold">
                      / month
                    </span>
                  </div>
                  <ul className="flex flex-col gap-3 text-xs font-medium text-theme-text-sec mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      Unlimited dashboard sites
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      Custom branding layout hooks
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-theme-success shrink-0" />{" "}
                      Dedicated Account Architect
                    </li>
                  </ul>
                  <button
                    onClick={() =>
                      triggerToast("success", "Enterprise callback scheduled")
                    }
                    className="mt-auto w-full py-3 bg-theme-bg-sec border border-theme-border-med hover:bg-theme-border-light text-theme-text font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="flex flex-col gap-10">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-theme-accent bg-theme-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Testimonials
                </span>
                <h2 className="font-sans font-extrabold text-3xl text-theme-text mt-4">
                  Verified Customer Reviews
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    name: "Sarah Jenkins",
                    role: "VP of Product at Invision",
                    stars: 5,
                    quote:
                      "Switching themes on previous frameworks used to feel jerky and caused page flash. Aura solves this cleanly with a lightweight DOM hook. Access scores reached 99.8% compliance.",
                  },
                  {
                    name: "Michael Torres",
                    role: "Lead Software Architect, Stripe Labs",
                    stars: 5,
                    quote:
                      "The accessibility benchmarks on these UI controls are incredible. Focus states, screen-reader descriptors, and responsive keyboard navigability worked out of the box.",
                  },
                ].map((t, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-8 rounded-3xl border border-theme-border-light bg-theme-surface shadow-md hover:shadow-lg transition-all flex flex-col gap-4"
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <blockquote className="text-sm italic font-medium text-theme-text-sec">
                      "{t.quote}"
                    </blockquote>
                    <div className="flex items-center gap-3 border-t border-theme-border-light pt-4 mt-auto">
                      <div className="w-9 h-9 rounded-full bg-theme-primary text-white flex items-center justify-center font-bold text-xs">
                        {t.name[0]}
                      </div>
                      <div>
                        <cite className="not-italic font-bold text-xs text-theme-text block">
                          {t.name}
                        </cite>
                        <span className="text-[10px] text-theme-text-muted font-semibold">
                          {t.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TEAM CARDS */}
            <section className="flex flex-col gap-10">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-theme-secondary bg-theme-secondary/15 px-3 py-1 rounded-full uppercase tracking-wider">
                  Meet The Team
                </span>
                <h2 className="font-sans font-extrabold text-3xl text-theme-text mt-4">
                  Pioneers of Accessible Web Design
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    name: "Alex Rivers",
                    role: "Creative Director",
                    initial: "AR",
                  },
                  {
                    name: "Devon Chen",
                    role: "Accessibility Specialist",
                    initial: "DC",
                  },
                  {
                    name: "Elena Rostova",
                    role: "Frontend Lead",
                    initial: "ER",
                  },
                  {
                    name: "Marcus Stone",
                    role: "Systems Architect",
                    initial: "MS",
                  },
                ].map((member, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-6 rounded-3xl border border-theme-border-light bg-theme-surface shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center flex flex-col items-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-theme-primary to-theme-accent flex items-center justify-center text-white font-bold text-2xl shadow-md mb-4">
                      {member.initial}
                    </div>
                    <h3 className="font-bold text-sm text-theme-text">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-theme-text-muted font-bold uppercase mt-1">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* BLOG CARDS */}
            <section className="flex flex-col gap-10">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold text-theme-primary bg-theme-primary-light px-3 py-1 rounded-full uppercase tracking-wider">
                  Articles & News
                </span>
                <h2 className="font-sans font-extrabold text-3xl text-theme-text mt-4">
                  Latest design guidelines
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Designing for WCAG AA Standards in 2026",
                    date: "July 12, 2026",
                    tag: "Accessibility",
                    desc: "An in-depth study of HSL colors, contrast parameters, and tab focus indicators for keyboard navigation.",
                  },
                  {
                    title: "The Physics of Transition Animations",
                    date: "July 04, 2026",
                    tag: "Animations",
                    desc: "Balancing micro-animations between 200ms and 300ms for responsiveness without causing user fatigue.",
                  },
                  {
                    title: "CSS Custom Properties vs Utility Frameworks",
                    date: "June 28, 2026",
                    tag: "Architecture",
                    desc: "How we structured Aura with design tokens that dynamically switch values between light and dark modes.",
                  },
                ].map((post, idx) => (
                  <article
                    key={idx}
                    className="glass-panel rounded-3xl border border-theme-border-light bg-theme-surface shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col"
                  >
                    <div className="h-44 bg-gradient-to-br from-theme-primary/10 to-theme-accent/20 flex items-center justify-center p-6 border-b border-theme-border-light relative">
                      <Bookmark className="absolute top-4 right-4 w-4 h-4 text-theme-text-muted hover:text-theme-primary cursor-pointer" />
                      <Layers className="w-12 h-12 text-theme-primary/40" />
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-theme-primary uppercase bg-theme-primary-light px-2.5 py-0.5 rounded-full">
                          {post.tag}
                        </span>
                        <span className="text-theme-text-muted">
                          {post.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-theme-text hover:text-theme-primary transition-colors cursor-pointer leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs text-theme-text-sec font-medium leading-relaxed">
                        {post.desc}
                      </p>
                      <button
                        onClick={() =>
                          triggerToast("info", `Opening: ${post.title}`)
                        }
                        className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-theme-primary hover:underline hover:gap-1.5 transition-all text-left w-fit pt-2 cursor-pointer"
                      >
                        Read full guide <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* FAQ ACCORDION */}
            <section className="flex grid grid-cols-1 lg:grid-cols-12 gap-12 py-6">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <span className="text-xs font-bold text-theme-primary uppercase tracking-widest">
                  Support FAQ
                </span>
                <h2 className="font-sans font-extrabold text-3xl text-theme-text leading-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-theme-text-sec font-medium">
                  Have questions about accessibility compliance, themes, or
                  license keys?
                </p>
              </div>
              <div className="lg:col-span-7 flex flex-col gap-4">
                {[
                  {
                    q: "What is WCAG AA and how is it ensured here?",
                    a: "WCAG AA requires a color contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. All our colors (including brand primary `#2563EB`) automatically satisfy these values in both light and dark themes.",
                  },
                  {
                    q: "How does the Theme Toggle transition without flashing?",
                    a: "The toggle updates a `data-theme` attribute on the DOM. We use CSS variables to map background, border, and text parameters. This enables the browser to recalculate styling instantly without any flash.",
                  },
                  {
                    q: "Is there support for reduced-motion settings?",
                    a: "Yes, we integrate `@media (prefers-reduced-motion: reduce)` rules globally, disabling or slowing down animations for users who have this OS option enabled.",
                  },
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="glass-panel border border-theme-border-light rounded-2xl bg-theme-surface overflow-hidden transition-all"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === idx ? null : idx)
                      }
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-theme-text hover:bg-theme-bg-sec transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-theme-text-muted transition-transform ${expandedFaq === idx ? "rotate-180 text-theme-primary" : ""}`}
                      />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-6 pb-5 pt-1 text-xs text-theme-text-sec font-medium leading-relaxed border-t border-theme-border-light/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================================== CATEGORY 2: DASHBOARD & STATS ==================================== */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* COLLAPSIBLE SIDEBAR - Dashboard navigation */}
            <aside className="lg:col-span-3 glass-panel p-4 rounded-3xl border border-theme-border-light bg-theme-surface flex flex-col gap-6 shadow-md">
              <div className="flex items-center gap-2 px-2">
                <LayoutDashboard className="w-5 h-5 text-theme-primary" />
                <span className="font-bold text-sm text-theme-text">
                  Developer Workspace
                </span>
              </div>
              <nav className="flex flex-col gap-1">
                {[
                  {
                    label: "Overview Metrics",
                    icon: BarChart3,
                    count: "Active",
                  },
                  {
                    label: "System Schedules",
                    icon: CalendarIcon,
                    count: "12",
                  },
                  { label: "Settings Pane", icon: Settings },
                  { label: "Raw Logs Database", icon: FileText },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      triggerToast("info", `Opening ${item.label}...`)
                    }
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between hover:bg-theme-bg-sec text-theme-text-sec hover:text-theme-text transition-all cursor-pointer ${
                      idx === 0
                        ? "bg-theme-primary-light text-theme-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          idx === 0
                            ? "bg-theme-primary text-white"
                            : "bg-theme-bg-sec text-theme-text-muted"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </aside>

            {/* DASHBOARD CONTENT PANEL */}
            <div className="lg:col-span-9 flex flex-col gap-8">
              {/* BREADCRUMBS */}
              <nav className="flex items-center gap-2 text-xs font-semibold text-theme-text-muted">
                <span
                  className="hover:text-theme-text cursor-pointer"
                  onClick={() => setActiveTab("landing")}
                >
                  Home
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span
                  className="hover:text-theme-text cursor-pointer"
                  onClick={() => setActiveTab("dashboard")}
                >
                  Dashboard
                </span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="text-theme-primary font-bold">
                  Analytics Overview
                </span>
              </nav>

              {/* STATISTICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Net Revenue",
                    val: "$45,290",
                    icon: DollarSign,
                    trend: "+12.4%",
                    trendColor: "text-theme-success",
                    color: "border-t-theme-primary shadow-sm",
                  },
                  {
                    title: "Total Users",
                    val: "24,809",
                    icon: Users,
                    trend: "+8.3%",
                    trendColor: "text-theme-success",
                    color: "border-t-theme-secondary shadow-sm",
                  },
                  {
                    title: "SaaS Conversions",
                    val: "4.82%",
                    icon: TrendingUp,
                    trend: "-1.5%",
                    trendColor: "text-theme-error",
                    color: "border-t-theme-accent shadow-sm",
                  },
                  {
                    title: "Pending Invoices",
                    val: "18",
                    icon: Briefcase,
                    trend: "Stable",
                    trendColor: "text-theme-text-muted",
                    color: "border-t-theme-warning shadow-sm",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`glass-panel p-6 rounded-3xl border border-theme-border-light border-t-4 bg-theme-surface hover:-translate-y-1 transition-all ${stat.color}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">
                        {stat.title}
                      </span>
                      <stat.icon className="w-4 h-4 text-theme-text-muted" />
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-2xl font-extrabold text-theme-text leading-none">
                        {stat.val}
                      </p>
                      <span
                        className={`text-[10px] font-extrabold ${stat.trendColor}`}
                      >
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEARCH BAR & FILTERS COMPONENT */}
              <div className="glass-panel p-4 rounded-2xl border border-theme-border-light bg-theme-surface flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
                  <input
                    type="search"
                    placeholder="Search logs database..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary text-theme-text transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider shrink-0">
                    Filter Status:
                  </span>
                  {["All Logs", "Resolved", "Failed", "Pending"].map((f, i) => (
                    <button
                      key={f}
                      onClick={() =>
                        triggerToast("info", `Applied filter: ${f}`)
                      }
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-colors shrink-0 cursor-pointer ${
                        i === 0
                          ? "bg-theme-primary border-theme-primary text-white"
                          : "bg-theme-bg-sec border-theme-border-light text-theme-text hover:bg-theme-border-light"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* DASHBOARD CARD & ACCESSIBLE TABLE */}
              <div className="glass-panel rounded-3xl border border-theme-border-light bg-theme-surface shadow-md overflow-hidden flex flex-col">
                <div className="p-6 border-b border-theme-border-light flex justify-between items-center bg-theme-bg-sec/50">
                  <div>
                    <h3 className="font-extrabold text-sm text-theme-text">
                      Recent Invoices
                    </h3>
                    <p className="text-[11px] text-theme-text-muted font-medium">
                      Overview of monthly business payouts.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      triggerToast("success", "Exporting logs to CSV...")
                    }
                    className="px-3 py-1.5 bg-theme-primary-light hover:bg-theme-primary/20 text-theme-primary font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Export CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-theme-border-light bg-theme-bg-sec text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">
                        <th className="py-3 px-6">Customer</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Amount</th>
                        <th className="py-3 px-6">Created</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-semibold text-theme-text-sec">
                      {[
                        {
                          name: "Acme Corporates",
                          email: "acme@example.com",
                          status: "success",
                          amt: "$1,489.00",
                          date: "Jul 17, 2026",
                        },
                        {
                          name: "Designify Ltd.",
                          email: "info@designify.co",
                          status: "pending",
                          amt: "$840.50",
                          date: "Jul 16, 2026",
                        },
                        {
                          name: "BetaCorp Inc.",
                          email: "billing@betacorp.xyz",
                          status: "error",
                          amt: "$2,100.00",
                          date: "Jul 14, 2026",
                        },
                      ].map((invoice, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-theme-border-light hover:bg-theme-bg-sec/40 transition-colors"
                        >
                          <td className="py-4 px-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-theme-primary-light text-theme-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {invoice.name[0]}
                            </div>
                            <div>
                              <p className="text-theme-text font-bold leading-none">
                                {invoice.name}
                              </p>
                              <p className="text-[10px] text-theme-text-muted mt-0.5">
                                {invoice.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                invoice.status === "success"
                                  ? "bg-theme-success/15 border-theme-success/20 text-theme-success"
                                  : invoice.status === "pending"
                                    ? "bg-theme-warning/15 border-theme-warning/20 text-theme-warning"
                                    : "bg-theme-error/15 border-theme-error/20 text-theme-error"
                              }`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono text-theme-text">
                            {invoice.amt}
                          </td>
                          <td className="py-4 px-6 text-theme-text-muted">
                            {invoice.date}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() =>
                                triggerToast(
                                  "info",
                                  `Viewing details for ${invoice.name}`,
                                )
                              }
                              className="px-2.5 py-1 bg-theme-bg-sec hover:bg-theme-border-light text-theme-text border border-theme-border-light rounded-lg transition-colors cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION COMPONENT */}
                <div className="p-4 border-t border-theme-border-light flex items-center justify-between bg-theme-bg-sec/50 text-xs font-semibold text-theme-text-sec">
                  <button
                    onClick={() =>
                      triggerToast("info", "Loading previous page...")
                    }
                    className="px-3 py-1.5 border border-theme-border-med bg-theme-surface hover:bg-theme-bg-sec rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((p) => (
                      <button
                        key={p}
                        onClick={() =>
                          triggerToast("info", `Switched to page ${p}`)
                        }
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
                          p === 1
                            ? "bg-theme-primary border-theme-primary text-white"
                            : "bg-theme-surface border-theme-border-light hover:bg-theme-bg-sec"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => triggerToast("info", "Loading next page...")}
                    className="px-3 py-1.5 border border-theme-border-med bg-theme-surface hover:bg-theme-bg-sec rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PROGRESS BARS */}
              <div className="glass-panel p-6 rounded-3xl border border-theme-border-light bg-theme-surface shadow-md flex flex-col gap-6">
                <div>
                  <h3 className="font-extrabold text-sm text-theme-text">
                    Resource Telemetry Progress
                  </h3>
                  <p className="text-[11px] text-theme-text-muted font-medium">
                    Monitoring memory quotas, energy loads, and API consumption.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {/* Progress 1 */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-theme-text mb-1.5">
                      <span>API Server Requests limit</span>
                      <span className="text-theme-primary">82% capacity</span>
                    </div>
                    <div className="w-full h-2.5 bg-theme-bg-sec rounded-full overflow-hidden">
                      <div
                        className="h-full bg-theme-primary rounded-full transition-all duration-500"
                        style={{ width: "82%" }}
                      />
                    </div>
                  </div>
                  {/* Progress 2 */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-theme-text mb-1.5">
                      <span>Energy Load Peak Indicator</span>
                      <span className="text-theme-warning">64% load</span>
                    </div>
                    <div className="w-full h-2.5 bg-theme-bg-sec rounded-full overflow-hidden">
                      <div
                        className="h-full bg-theme-warning rounded-full transition-all duration-500"
                        style={{ width: "64%" }}
                      />
                    </div>
                  </div>
                  {/* Progress 3 */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-theme-text mb-1.5">
                      <span>System Storage Threshold</span>
                      <span className="text-theme-error">95% CRITICAL</span>
                    </div>
                    <div className="w-full h-2.5 bg-theme-bg-sec rounded-full overflow-hidden">
                      <div
                        className="h-full bg-theme-error rounded-full transition-all duration-500"
                        style={{ width: "95%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== CATEGORY 3: AUTH & FORMS ==================================== */}
        {activeTab === "auth" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-6">
            {/* LOGIN PAGE CARD (Frosted Glass) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="text-center max-w-sm mx-auto">
                <span className="text-xs font-bold text-theme-primary uppercase tracking-widest bg-theme-primary-light px-3 py-1 rounded-full">
                  Secure Auth Gateway
                </span>
                <h2 className="font-sans font-extrabold text-2xl text-theme-text mt-4">
                  Login to your console
                </h2>
              </div>
              <div className="glass-panel p-8 rounded-3xl border border-theme-border-light bg-theme-surface shadow-xl flex flex-col gap-5 max-w-md mx-auto w-full">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-theme-text">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-theme-text-muted" />
                    <input
                      type="email"
                      placeholder="e.g. name@mail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary text-xs font-semibold text-theme-text transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-theme-text">
                      Password
                    </label>
                    <button
                      onClick={() =>
                        triggerToast("info", "Password reset sent")
                      }
                      className="text-[10px] font-bold text-theme-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-theme-text-muted" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter security key"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary text-xs font-semibold text-theme-text transition-all"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="w-4 h-4 rounded text-theme-primary border-theme-border-light"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-[11px] text-theme-text-sec font-semibold select-none cursor-pointer"
                  >
                    Remember device for 30 days
                  </label>
                </div>
                <button
                  onClick={() => {
                    if (!loginEmail || !loginPassword) {
                      triggerToast(
                        "error",
                        "Invalid login parameters. Email and password are required.",
                      );
                    } else {
                      triggerToast(
                        "success",
                        `Welcome back, User! Active profile: ${loginEmail}`,
                      );
                    }
                  }}
                  className="w-full py-3.5 bg-theme-primary hover:bg-theme-primary-hover text-white font-bold rounded-xl shadow-lg shadow-theme-primary/10 transition-colors mt-2 cursor-pointer"
                >
                  Authenticate Profile
                </button>
              </div>
            </div>

            {/* CONTACT FORM & INTERACTIVE TOAST TRIGGERS */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="text-center max-w-sm mx-auto">
                <span className="text-xs font-bold text-theme-accent uppercase tracking-widest bg-theme-accent/10 px-3 py-1 rounded-full">
                  Interactive Operations
                </span>
                <h2 className="font-sans font-extrabold text-2xl text-theme-text mt-4">
                  Contact & Inquiries
                </h2>
              </div>
              <div className="glass-panel p-8 rounded-3xl border border-theme-border-light bg-theme-surface shadow-xl flex flex-col gap-4 max-w-md mx-auto w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-theme-text">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John"
                      className="w-full px-4 py-2.5 bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary text-xs font-semibold text-theme-text transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-theme-text">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doe"
                      className="w-full px-4 py-2.5 bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary text-xs font-semibold text-theme-text transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-theme-text">
                    Subject Topic
                  </label>
                  <select className="w-full px-4 py-2.5 bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary text-xs font-semibold text-theme-text transition-all">
                    <option>Standard Partnership Request</option>
                    <option>Accessibility Audit Inquiry</option>
                    <option>Premium license Billing</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-theme-text">
                    Detailed Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter your specific question or feature request..."
                    className="w-full px-4 py-2.5 bg-theme-bg-sec border border-theme-border-light rounded-xl focus:outline-none focus:border-theme-primary text-xs font-semibold text-theme-text transition-all resize-none"
                  />
                </div>
                <button
                  onClick={() =>
                    triggerToast(
                      "success",
                      "Your message has been sent successfully!",
                    )
                  }
                  className="w-full py-3.5 bg-theme-accent hover:bg-theme-accent/90 text-white font-bold rounded-xl shadow-lg shadow-theme-accent/15 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Submit Inquiry
                </button>
              </div>

              {/* Toast Trigger Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-theme-border-light bg-theme-surface max-w-md mx-auto w-full shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">
                  Test Toast Alerts
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      triggerToast(
                        "success",
                        "Operation completed successfully!",
                      )
                    }
                    className="py-2.5 bg-theme-success/15 hover:bg-theme-success/25 border border-theme-success/30 text-theme-success font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Success Toast
                  </button>
                  <button
                    onClick={() =>
                      triggerToast("error", "Database connection timeout!")
                    }
                    className="py-2.5 bg-theme-error/15 hover:bg-theme-error/25 border border-theme-error/30 text-theme-error font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Error Toast
                  </button>
                  <button
                    onClick={() =>
                      triggerToast("warning", "Disk quotas reaching 90%!")
                    }
                    className="py-2.5 bg-theme-warning/15 hover:bg-theme-warning/25 border border-theme-warning/30 text-theme-warning font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Warning Toast
                  </button>
                  <button
                    onClick={() =>
                      triggerToast("info", "AuraEngine v2.0.1 hotfix deployed.")
                    }
                    className="py-2.5 bg-theme-info/15 hover:bg-theme-info/25 border border-theme-info/30 text-theme-info font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Info Toast
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================== CATEGORY 4: UI SHOWCASE ==================================== */}
        {activeTab === "ui" && (
          <div className="flex flex-col gap-10">
            {/* TABS COMPONENT */}
            <div className="glass-panel p-6 rounded-3xl border border-theme-border-light bg-theme-surface shadow-sm">
              <h3 className="font-extrabold text-sm text-theme-text mb-4">
                Responsive Tabs Switcher
              </h3>
              <div className="border-b border-theme-border-light">
                <div className="flex gap-4">
                  {[
                    { key: "tab1", label: "System Timeline" },
                    { key: "tab2", label: "Interactive Calendar" },
                    { key: "tab3", label: "States & Loading Mockups" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setUiTab(tab.key as any)}
                      className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                        uiTab === tab.key
                          ? "text-theme-primary font-black"
                          : "text-theme-text-muted hover:text-theme-text"
                      }`}
                    >
                      {tab.label}
                      {uiTab === tab.key && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-theme-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1 Content - TIMELINE */}
              {uiTab === "tab1" && (
                <div className="pt-6 animate-fade-in">
                  <div className="flex flex-col gap-6 max-w-lg">
                    {[
                      {
                        step: "Sprint Alpha",
                        date: "June 14, 2026",
                        desc: "Redesigned global custom properties inside root CSS modules.",
                        status: "completed",
                      },
                      {
                        step: "Sprint Beta Audit",
                        date: "July 01, 2026",
                        desc: "Checked HSL values under strict light/dark configurations.",
                        status: "completed",
                      },
                      {
                        step: "Release Candidate 1",
                        date: "July 17, 2026",
                        desc: "Added floating layout triggers and verified screen-reader compliance.",
                        status: "pending",
                      },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 items-start relative"
                      >
                        {idx !== 2 && (
                          <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-theme-border-light" />
                        )}
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 shadow-sm ${
                            step.status === "completed"
                              ? "bg-theme-success/15 border-theme-success/30 text-theme-success"
                              : "bg-theme-primary-light border-theme-primary/30 text-theme-primary animate-pulse"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h4 className="font-bold text-xs text-theme-text">
                              {step.step}
                            </h4>
                            <span className="text-[9px] text-theme-text-muted font-semibold">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-xs text-theme-text-sec mt-1 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2 Content - CALENDAR */}
              {uiTab === "tab2" && (
                <div className="pt-6 animate-fade-in">
                  <div className="max-w-sm border border-theme-border-light rounded-2xl p-4 bg-theme-bg-sec/50">
                    <div className="flex justify-between items-center border-b border-theme-border-light pb-3 mb-3">
                      <span className="font-extrabold text-xs text-theme-text">
                        July 2026
                      </span>
                      <div className="flex gap-1.5">
                        <button className="p-1 rounded border border-theme-border-light bg-theme-surface hover:bg-theme-bg-sec">
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded border border-theme-border-light bg-theme-surface hover:bg-theme-bg-sec">
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-theme-text-muted mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-theme-text-sec">
                      {/* Empty pads for starting offset */}
                      {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className="py-1.5 opacity-25">
                          28
                        </span>
                      ))}
                      {/* Days of month */}
                      {Array.from({ length: 31 }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedDate === day;
                        return (
                          <button
                            key={day}
                            onClick={() => setSelectedDate(day)}
                            className={`py-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-theme-primary border-theme-primary text-white shadow-sm font-bold"
                                : "border-transparent hover:bg-theme-bg"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3 Content - STATES & LOADING SKELETON */}
              {uiTab === "tab3" && (
                <div className="pt-6 animate-fade-in flex flex-col gap-6">
                  {/* SKELETON LOADING */}
                  <div>
                    <h4 className="text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-3">
                      Skeleton Loading State
                    </h4>
                    <div className="max-w-md p-5 border border-theme-border-light rounded-2xl bg-theme-bg-sec/50 animate-pulse flex flex-col gap-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-full bg-theme-border-medium" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-3.5 bg-theme-border-medium rounded-full w-2/3" />
                          <div className="h-2.5 bg-theme-border-medium rounded-full w-1/3" />
                        </div>
                      </div>
                      <div className="h-2.5 bg-theme-border-medium rounded-full w-full" />
                      <div className="h-2.5 bg-theme-border-medium rounded-full w-5/6" />
                    </div>
                  </div>

                  {/* EMPTY STATE */}
                  <div className="border border-dashed border-theme-border-med p-8 rounded-2xl text-center flex flex-col items-center gap-3">
                    <HelpCircle className="w-10 h-10 text-theme-text-muted" />
                    <div>
                      <h4 className="font-bold text-xs text-theme-text">
                        No pending logs found
                      </h4>
                      <p className="text-[11px] text-theme-text-muted mt-0.5">
                        Everything is resolved and optimized.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        triggerToast("info", "Refreshing database...")
                      }
                      className="px-3.5 py-1.5 bg-theme-primary text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Scan Again
                    </button>
                  </div>

                  {/* ERROR SCREEN */}
                  <div className="p-6 border border-theme-error/20 bg-theme-error/5 rounded-2xl flex items-center gap-4">
                    <ShieldAlert className="w-10 h-10 text-theme-error shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-theme-error">
                        Database connection timeout (Code 404)
                      </h4>
                      <p className="text-[11px] text-theme-text-muted mt-0.5">
                        Failed to initialize active connections. Please check
                        host routing rules.
                      </p>
                    </div>
                  </div>

                  {/* SUCCESS SCREEN */}
                  <div className="p-6 border border-theme-success/20 bg-theme-success/5 rounded-2xl flex items-center gap-4">
                    <CheckCircle2 className="w-10 h-10 text-theme-success shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs text-theme-success">
                        SaaS Billing initialized successfully!
                      </h4>
                      <p className="text-[11px] text-theme-text-muted mt-0.5">
                        Your Pro Team subscription is fully configured. Head
                        over to billing console.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODALS TRIGGER */}
            <div className="glass-panel p-6 rounded-3xl border border-theme-border-light bg-theme-surface shadow-sm text-center">
              <h3 className="font-sans font-extrabold text-lg text-theme-text">
                Accessible Modals
              </h3>
              <p className="text-xs text-theme-text-sec mt-1 max-w-md mx-auto">
                Toggle our custom modals designed with full keyboard trapping
                and high-contrast styling.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-5 py-2.5 bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Launch Dialogue Modal
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-theme-border-light bg-theme-surface py-12 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-theme-primary flex items-center justify-center text-white font-bold text-sm">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-theme-text">
                AURA<span className="text-theme-primary">.</span>
              </span>
            </div>
            <p className="text-xs text-theme-text-muted leading-relaxed">
              Design systems with light/dark interfaces meeting WCAG AA
              accessibility standards.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xs text-theme-text uppercase tracking-widest mb-3">
              Components
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-theme-text-sec font-semibold">
              <li
                className="hover:text-theme-primary cursor-pointer"
                onClick={() => setActiveTab("landing")}
              >
                Hero & Headers
              </li>
              <li
                className="hover:text-theme-primary cursor-pointer"
                onClick={() => setActiveTab("dashboard")}
              >
                Charts & Statistics
              </li>
              <li
                className="hover:text-theme-primary cursor-pointer"
                onClick={() => setActiveTab("auth")}
              >
                Forms & Modals
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-theme-text uppercase tracking-widest mb-3">
              Compliance
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-theme-text-sec font-semibold">
              <li className="hover:text-theme-primary cursor-pointer">
                WCAG AA Standard
              </li>
              <li className="hover:text-theme-primary cursor-pointer">
                Keyboard Navigation
              </li>
              <li className="hover:text-theme-primary cursor-pointer">
                Contrast check
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-theme-text uppercase tracking-widest mb-3">
              Newsletter
            </h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast("success", "Subscribed to newsletter!");
              }}
              className="flex gap-2 mt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter email"
                className="px-3 py-2 bg-theme-bg-sec border border-theme-border-light rounded-lg text-xs font-semibold text-theme-text focus:outline-none focus:border-theme-primary flex-1"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-theme-primary text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-theme-border-light mt-8 pt-6 text-center text-[10px] font-bold text-theme-text-muted">
          © 2026 Aura Design System. All rights reserved.
        </div>
      </footer>

      {/* ACCESSIBLE DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel p-6 max-w-sm w-full bg-theme-surface border border-theme-border-light rounded-3xl shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text p-1.5 rounded-lg border border-theme-border-light bg-theme-bg-sec/50"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-theme-primary-light text-theme-primary flex items-center justify-center">
                <Info className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-theme-text">
                  Aura Demo System Dialog
                </h3>
                <p className="text-xs text-theme-text-sec mt-1.5 leading-relaxed">
                  This demo dialog simulates keyboard trap capabilities and
                  focus outline indicators. Ready for production usage.
                </p>
              </div>
              <div className="flex gap-3 w-full border-t border-theme-border-light pt-4 mt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 bg-theme-bg-sec border border-theme-border-med text-theme-text font-bold text-xs rounded-xl hover:bg-theme-border-light cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    triggerToast("success", "Demo confirmed successfully");
                  }}
                  className="flex-1 py-2.5 bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
