import { useState, useEffect, useRef, useCallback } from "react";
import {
  Briefcase, Code2, Sun, Moon, ArrowRight, Sparkles, Zap,
  ShieldCheck, ChevronRight, Star, Users, TrendingUp, Hand
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Arrays from "./pages/Arrays.jsx";
import JobDashboard from "./pages/JobDashboard.jsx";

const THEME_KEY = "navi-theme";

/* ── Floating particles background ── */
const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size: 3 + Math.random() * 6,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 15 + Math.random() * 10,
  opacity: 0.1 + Math.random() * 0.2,
}));

/* ── Auto-hide header hook ── */
function useAutoHideHeader() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [route, setRoute] = useState(() => {
    const hash = window.location.hash;
    return ["#dsa", "#jobs"].includes(hash) ? hash : "#home";
  });

  const headerHidden = useAutoHideHeader();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = (e) => { if (!localStorage.getItem(THEME_KEY)) setTheme(e.matches ? "dark" : "light"); };
    media.addEventListener("change", handle);
    return () => media.removeEventListener("change", handle);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") { root.classList.add("dark"); root.classList.remove("light"); root.style.colorScheme = "dark"; }
    else { root.classList.add("light"); root.classList.remove("dark"); root.style.colorScheme = "light"; }
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setRoute(["#dsa", "#jobs"].includes(hash) ? hash : "#home");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }, [theme]);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 }
    }
  };

  if (route === "#dsa") return <Arrays theme={theme} toggleTheme={toggleTheme} />;
  if (route === "#jobs") return <JobDashboard theme={theme} toggleTheme={toggleTheme} />;

  /* ── HOME PORTAL ── */
  return (
    <div style={{
      minHeight: "100vh",
      background: theme === "dark"
        ? "linear-gradient(160deg, #0A0E1A 0%, #0F1320 50%, #0A0E1A 100%)"
        : "linear-gradient(160deg, #EEF2FF 0%, #F0F4FF 50%, #E8F5F0 100%)",
      color: "var(--text-primary)",
      fontFamily: "'Outfit', 'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflowX: "hidden",
      transition: "background 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>

      {/* ── Aurora Background Blobs ── */}
      <div className="aurora-blob aurora-blob-1" style={{
        width: 700, height: 700,
        top: "-20%", right: "-10%",
      }} />
      <div className="aurora-blob aurora-blob-2" style={{
        width: 600, height: 600,
        bottom: "10%", left: "-15%",
      }} />
      <div className="aurora-blob aurora-blob-3" style={{
        width: 400, height: 400,
        top: "40%", left: "30%",
      }} />

      {/* ── Floating Particles ── */}
      {PARTICLES.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size, height: p.size,
          left: `${p.left}%`,
          bottom: "-10px",
          background: theme === "dark"
            ? `rgba(0, 208, 156, ${p.opacity})`
            : `rgba(0, 169, 128, ${p.opacity * 0.7})`,
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}

      {/* ── Header ── */}
      <header className={`meta-header glass-nav ${headerHidden ? "hidden" : "visible"}`}>
        <div style={{
          maxWidth: 1200, width: "100%", margin: "0 auto",
          padding: "14px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              style={{
                width: 42, height: 42, borderRadius: 14,
                background: "linear-gradient(135deg, #00D09C 0%, #0866FF 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0, 208, 156, 0.4)",
              }}>
              <Sparkles size={20} color="#FFF" />
            </motion.div>
            <div>
              <div style={{
                fontWeight: 800, fontSize: 17, letterSpacing: "-0.5px",
                color: "var(--text-primary)",
              }}>
                JobTrackPro <span style={{ color: "var(--navi-green)" }}>portal</span>
              </div>
              <div style={{
                fontSize: 9, color: "var(--text-muted)", fontWeight: 700,
                letterSpacing: "1.2px", textTransform: "uppercase",
              }}>
                Wealth & SDE Arena
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }} className="hide-mobile">
              {[
                { label: "DSA Arena", hash: "#dsa", icon: Code2 },
                { label: "Job Tracker", hash: "#jobs", icon: Briefcase },
              ].map(({ label, hash, icon: Icon }) => (
                <motion.a 
                  key={hash} 
                  href={hash} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 99,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    fontSize: 12, fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "var(--navi-green)";
                    e.currentTarget.style.color = "var(--navi-green)";
                    e.currentTarget.style.background = "var(--navi-green-soft)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "var(--bg-card)";
                  }}>
                  <Icon size={13} /> {label}
                </motion.a>
              ))}
            </div>

            <motion.button 
              onClick={toggleTheme} 
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "50%",
                width: 40, height: 40,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--navi-green)"; e.currentTarget.style.color = "var(--navi-green)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVars}
        style={{
          flex: 1, maxWidth: 1100, width: "100%",
          margin: "0 auto", padding: "140px 24px 100px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 10,
        }}
      >
        <motion.div variants={itemVars} style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          padding: "7px 18px", borderRadius: 99,
          background: "var(--navi-green-soft)",
          border: "1px solid var(--navi-green-border)",
          color: "var(--navi-green)",
          fontSize: 12, fontWeight: 700, marginBottom: 28,
          letterSpacing: "0.03em",
        }}>
          <Zap size={12} fill="var(--navi-green)" />
          Next-Gen SDE Career Platform
          <ChevronRight size={12} />
        </motion.div>

        <motion.div variants={itemVars} style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 className="hero-title" style={{
            fontSize: "clamp(36px, 7vw, 68px)",
            color: "var(--text-primary)",
            marginBottom: 0,
            lineHeight: 1.1,
            fontWeight: 900,
          }}>
            Master Coding.{" "}
            <span className="gradient-text">Track Wealth.</span>
          </h1>
        </motion.div>

        <motion.p variants={itemVars} style={{
          fontSize: "clamp(15px, 2.5vw, 18px)",
          color: "var(--text-secondary)",
          maxWidth: 580, margin: "0 auto 50px",
          lineHeight: 1.65, fontWeight: 400,
          textAlign: "center",
        }}>
          Launch the interactive DSA Mastery board to polish problem-solving skills,
          or keep tabs on your job pipeline, offers, and credentials — all in one premium dashboard.
        </motion.p>

        <motion.div variants={itemVars} style={{
          display: "flex", gap: 32, marginBottom: 56,
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { icon: Code2, label: "DSA Problems", val: "100+" },
            { icon: TrendingUp, label: "Job Stages", val: "6" },
            { icon: ShieldCheck, label: "Secure Vaults", val: "∞" },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 10,
              color: "var(--text-secondary)", fontSize: 13, fontWeight: 500,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "var(--navi-green-soft)",
                border: "1px solid var(--navi-green-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={14} color="var(--navi-green)" />
              </div>
              <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 15 }}>{val}</span>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Portal Cards */}
        <motion.div variants={itemVars} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24, width: "100%",
        }}>

           <PortalCard
            hash="#jobs"
            icon={Briefcase}
            accentColor="#0866FF"
            topGradient="linear-gradient(90deg, #0866FF, #00D09C)"
            title="Job Applications Tracker"
            desc="Organize your interviews, referrals, and CTC offerings. Export CSV reports, keep platform account credentials secure, and evaluate pipeline success."
            cta="Open Applications Tracker"
            stats={[{ icon: TrendingUp, text: "6 application stages" }, { icon: ShieldCheck, text: "Encrypted credentials vault" }]}
          />

          
          <PortalCard
            hash="#dsa"
            icon={Code2}
            accentColor="#00D09C"
            topGradient="linear-gradient(90deg, #00D09C, #0866FF)"
            title="DSA Mastery Arena"
            desc="Build robust coding patterns. Crack Amazon, LeetCode, and Striver sheet questions with clean optimal solutions, visual breakdowns, and progress tracking."
            cta="Go to DSA Arena"
            stats={[{ icon: Star, text: "100+ curated problems" }, { icon: Users, text: "LeetCode · Striver · GFG" }]}
          />

         
        </motion.div>
      </motion.main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "22px 24px",
        textAlign: "center",
        fontSize: 12,
        color: "var(--text-muted)",
        fontWeight: 500,
        position: "relative", zIndex: 10,
        background: "var(--bg-glass)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 7 }}>
          <ShieldCheck size={13} color="var(--navi-green)" />
          Secured · App · JobTrack And Dsa Question Track Pro
        </div>
      </footer>
    </div>
  );
}

function PortalCard({ hash, icon: Icon, accentColor, topGradient, title, desc, cta, stats }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a 
      href={hash} 
      style={{ textDecoration: "none" }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "var(--bg-card)",
          borderRadius: 24,
          border: "1px solid var(--border)",
          padding: "36px 30px",
          height: "100%",
          cursor: "pointer",
          boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.12), 0 0 0 1.5px ${accentColor}` : "var(--shadow-md)",
          display: "flex", flexDirection: "column",
          position: "relative", overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: 5,
          background: topGradient, opacity: hovered ? 1 : 0.7,
        }} />

        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}11)`,
          border: `1px solid ${accentColor}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 22,
        }}>
          <motion.div animate={{ rotate: hovered ? 360 : 0 }} transition={{ duration: 0.6 }}>
            <Icon size={24} color={accentColor} strokeWidth={2} />
          </motion.div>
        </div>

        <h3 style={{
          fontSize: 22, fontWeight: 800, marginBottom: 10,
          color: "var(--text-primary)",
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6,
          flex: 1, marginBottom: 24,
        }}>
          {desc}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {stats.map(({ icon: SIcon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
              <SIcon size={14} color={accentColor} />
              {text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: accentColor }}>
          {cta}
          <motion.div animate={{ x: hovered ? 6 : 0 }}>
            <ArrowRight size={18} />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
}