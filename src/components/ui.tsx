"use client";

import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import logo from "@/assets/logo/astral-logo.jpg";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <p className="eyebrow mb-5">{eyebrow}</p>
      <h2 className="display text-4xl leading-[1.05] sm:text-6xl">{title}</h2>
      {lead && <p className="mt-6 text-lg leading-relaxed text-muted">{lead}</p>}
    </Reveal>
  );
}

/** Scroll progress drawn as a measuring tape along the top edge. */
export function TapeProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-2 bg-transparent">
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0 50%",
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--accent) 0 1px, transparent 1px 8px), linear-gradient(var(--accent), var(--accent))",
          backgroundSize: "100% 55%, 100% 2px",
          backgroundPosition: "0 100%, 0 0",
          backgroundRepeat: "no-repeat",
        }}
        className="h-full w-full"
      />
    </div>
  );
}

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function ThemeToggle({ onDark = false }: { onDark?: boolean }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.dataset.theme ?? "light",
    () => "light",
  );
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <button
      onClick={flip}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`grid h-10 w-10 place-items-center rounded-full border transition hover:border-accent hover:text-accent ${
        onDark ? "border-white/30 text-white" : "border-line text-ink"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        )}
      </svg>
    </button>
  );
}

const links = [
  ["Works", "#works"],
  ["Craft", "#craft"],
  ["Corsetry", "#corsetry"],
  ["Process", "#process"],
  ["Journey", "#journey"],
  ["Reviews", "#reviews"],
  ["Contact", "#contact"],
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-2 z-40 transition-all duration-500 ${
        solid ? "backdrop-blur-md [background:color-mix(in_srgb,var(--bg)_80%,transparent)]" : "text-white"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-3 display text-2xl tracking-wide">
          <Image src={logo} alt="" width={40} height={40} priority className="h-10 w-10 rounded-full ring-1 ring-accent/60" />
          <span>
            Astral <span className="italic text-accent">Couture</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:flex lg:gap-9">
          {links.map(([l, h]) => (
            <a key={h} href={h} className={`group relative text-sm tracking-wide transition ${solid ? "text-muted hover:text-ink" : "text-white/75 hover:text-white"}`}>
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle onDark={!solid} />
          <a
            href="#contact"
            className={`hidden rounded-full border px-5 py-2.5 text-sm transition sm:block ${
              solid
                ? "border-accent text-accent hover:bg-accent hover:text-bg"
                : "border-[var(--gold-lit)] text-[var(--gold-lit)] hover:bg-[var(--gold-lit)] hover:text-black"
            }`}
          >
            Book a fitting
          </a>
        </div>
      </div>
    </header>
  );
}
