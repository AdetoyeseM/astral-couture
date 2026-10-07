"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, animate } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo/astral-logo.jpg";
import { photos } from "@/lib/works";
import { Reveal, SectionHead } from "./ui";

/* ───────────── Marquee ───────────── */
const words = ["Bridal Gowns", "Corsetry", "Aso-Ebi", "Adire", "Blazers & Suits", "Native Wear", "Two-Piece Sets", "Party Wear", "Pattern Drafting", "Beading & Embellishment"];

export function Marquee() {
  return (
    <div className="marquee overflow-hidden border-y border-line py-6" aria-hidden>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="display flex items-center gap-12 text-3xl italic text-muted sm:text-4xl">
            {w}
            <span className="text-accent not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────────── About + stats ───────────── */
function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => Math.round(n).toString());
  useEffect(() => {
    if (inView) animate(v, to, { duration: 1.8, ease: "easeOut" });
  }, [inView, to, v]);
  return (
    <span ref={ref}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { n: 6, s: "", l: "Years designing & sewing" },
  { n: 8, s: "", l: "Apprentices trained" },
  { n: 4, s: "", l: "Graduated from the programme" },
  { n: 2026, s: "", l: "Advanced corsetry certified" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div aria-hidden className="absolute -bottom-4 -right-4 h-full w-full rounded-[28px] border border-accent/50" />
          <figure className="relative overflow-hidden rounded-[28px] border border-line bg-surface">
            <Image
              src={photos.taupeSuit}
              alt="Idowu Esther, founder and lead designer of Astral Couture, in a tailored taupe two-piece with a yellow measuring tape around her neck"
              placeholder="blur"
              sizes="(max-width: 1024px) 90vw, 520px"
              className="aspect-[4/5] w-full object-cover"
              style={{ objectPosition: "50% 22%" }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 text-white">
              <p className="display text-2xl">Idowu Esther</p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.28em] text-[var(--gold-lit)]">Founder &amp; Lead Designer</p>
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <SectionHead
            eyebrow="The Designer"
            title={
              <>
                Idowu <span className="italic text-accent">Esther</span>
              </>
            }
          />
          <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-muted">
            <p>
              Founder of Astral Couture, Esther has spent six years turning measurements into garments that fit like they were
              always meant to. She owns the full production cycle in-house: cutting, construction, fitting and finishing.
            </p>
            <p>
              Her specialism is structured garments. Cupped corsets, bustiers, caging and hip padding, backed by advanced
              corsetry training completed in 2026. A remote consultation and fitting process serves international clients as
              carefully as those in her Ibadan studio.
            </p>
            <p>
              She also trains and mentors upcoming designers, bringing a degree in Childhood Education to a structured,
              practical way of teaching the craft.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08} y={16} className="bg-bg p-8 sm:p-10">
            <div className="display text-5xl text-accent sm:text-6xl">
              <Count to={s.n} suffix={s.s} />
            </div>
            <p className="mt-3 text-sm tracking-wide text-muted">{s.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────── The Craft (garment categories) ───────────── */
const pieces: { t: string; d: string; bg: string; size: string; img?: StaticImageData; pos?: string }[] = [
  { t: "Bridal & Wedding Gowns", d: "Constructed and corseted for structure, comfort and a flawless line.", bg: "radial-gradient(circle at 30% 30%, var(--accent-soft) 0 18%, transparent 19%), radial-gradient(circle at 70% 60%, var(--accent-soft) 0 24%, transparent 25%)", size: "sm:col-span-2 sm:row-span-2", img: photos.pearlLaceDress, pos: "50% 30%" },
  { t: "Aso-Ebi & Native Wear", d: "Aso-oke and traditional silhouettes, cut for celebration.", bg: "repeating-linear-gradient(135deg, var(--accent-soft) 0 10px, transparent 10px 22px)", size: "", img: photos.pinkLaceCorset, pos: "50% 30%" },
  { t: "Adire", d: "Indigenous Nigerian textiles, tailored into modern pieces.", bg: "repeating-radial-gradient(circle at 50% 50%, var(--accent-soft) 0 6px, transparent 6px 14px)", size: "" },
  { t: "Corporate, Blazers & Suits", d: "Sharp, fitted tailoring for work and occasion.", bg: "repeating-linear-gradient(90deg, var(--accent-soft) 0 2px, transparent 2px 14px)", size: "", img: photos.redStuddedSuit, pos: "50% 22%" },
  { t: "Gowns, Dresses & Party Wear", d: "Free-flowing gowns and evening pieces that move beautifully.", bg: "radial-gradient(circle, var(--accent) 0 1.5px, transparent 2px) 0 0/22px 22px", size: "sm:col-span-2", img: photos.blackCapeGown, pos: "50% 38%" },
];

function Tilt({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, ...style }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Craft() {
  return (
    <section id="craft" className="bg-bg-alt px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          eyebrow="The Craft"
          title={
            <>
              A wardrobe, made <span className="italic text-accent">to measure</span>
            </>
          }
          lead="From a wedding gown to a Monday blazer, each piece is bespoke or ready-to-wear, and finished to the same standard."
        />
        <div className="grid auto-rows-[260px] gap-5 sm:grid-cols-4">
          {pieces.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.07} className={p.size}>
              <Tilt className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7">
                {p.img ? (
                  <>
                    <Image
                      src={p.img}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: p.pos }}
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  </>
                ) : (
                  <div aria-hidden className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: p.bg }} />
                )}
                <div className={`relative flex h-full flex-col justify-end ${p.img ? "text-white" : ""}`}>
                  <span className={`mb-auto text-xs tracking-[0.3em] ${p.img ? "text-[var(--gold-lit)]" : "text-accent"}`}>0{i + 1}</span>
                  <h3 className="display text-3xl leading-tight sm:text-[2rem]">{p.t}</h3>
                  <p className={`mt-2 max-w-sm text-sm leading-relaxed ${p.img ? "text-white/80" : "text-muted"}`}>{p.d}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Corsetry ───────────── */
const corset = [
  { t: "Cupped & Princess Dart Bustiers", d: "Shaped cups and princess seams that sculpt the bust and hold it in place without compromise." },
  { t: "Caging", d: "Structural caging that gives a gown its architecture, visible or hidden." },
  { t: "Contour Back & Eyelet Techniques", d: "Contoured backs and laced eyelet closures, adjustable and beautifully finished." },
  { t: "Hip Padding", d: "Built-in shaping that defines the silhouette from waist to hip." },
  { t: "Dart Manipulation", d: "Darts moved and reshaped so structure becomes design." },
  { t: "Beading & Embellishment", d: "Hand detailing that takes a structured piece from precise to unforgettable." },
];

export function Corsetry() {
  const [i, setI] = useState(0);
  return (
    <section id="corsetry" className="mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHead
        eyebrow="Specialist Technique"
        title={
          <>
            Corsetry is the <span className="italic text-accent">quiet engineering</span>
          </>
        }
        lead="Advanced corsetry training, completed in 2026, sits behind every structured bridal and evening piece."
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <ul className="divide-y divide-line border-y border-line">
          {corset.map((c, k) => (
            <li key={c.t}>
              <button
                onMouseEnter={() => setI(k)}
                onFocus={() => setI(k)}
                onClick={() => setI(k)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-pressed={i === k}
              >
                <span className={`display text-2xl transition-all duration-300 sm:text-3xl ${i === k ? "translate-x-3 text-accent" : "text-ink"}`}>{c.t}</span>
                <span className={`text-sm text-accent transition ${i === k ? "opacity-100" : "opacity-0"}`}>●</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-line bg-surface p-10">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{ backgroundImage: "repeating-linear-gradient(100deg, var(--accent-soft) 0 1px, transparent 1px 18px)" }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="relative flex h-full min-h-[240px] flex-col justify-between"
            >
              <span className="display text-8xl text-accent/40">0{i + 1}</span>
              <div>
                <h3 className="display text-3xl">{corset[i].t}</h3>
                <p className="mt-4 text-lg leading-relaxed text-muted">{corset[i].d}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Process ───────────── */
const steps = [
  ["Consultation", "Style references, occasion and requirements, in studio in Ibadan or virtually."],
  ["Measurement", "Precise measurements, captured in person or guided remotely."],
  ["Pattern Drafting", "A pattern drafted from scratch to your body, never forced from a template."],
  ["Cutting", "Fabric selected and cut with care for grain, drape and finish."],
  ["Construction", "Built in-house, with corsetry and structure where the design calls for it."],
  ["Fitting & Adjustment", "Fitted and refined until it sits exactly as it should."],
  ["Finishing", "Quality control and final detailing before it leaves the studio."],
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="process" className="bg-bg-alt px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHead
          eyebrow="The Process"
          title={
            <>
              Seven stitches from <span className="italic text-accent">idea to garment</span>
            </>
          }
        />
        <div ref={ref} className="relative pl-12 sm:pl-20">
          <div className="absolute left-3 top-2 bottom-2 w-px border-l-[1.5px] border-dashed border-line sm:left-6" />
          <motion.div style={{ height: h }} className="absolute left-3 top-2 w-[2px] bg-accent sm:left-[23px]" />
          <ol className="space-y-14">
            {steps.map(([t, d], k) => (
              <li key={t} className="relative">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  className="absolute -left-[45px] top-3 h-3 w-3 rounded-full bg-accent ring-4 ring-bg-alt sm:-left-[63px]"
                />
                <Reveal>
                  <span className="text-xs tracking-[0.3em] text-accent">STEP 0{k + 1}</span>
                  <h3 className="display mt-2 text-3xl sm:text-5xl">{t}</h3>
                  <p className="mt-3 max-w-xl text-lg text-muted">{d}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-24 rounded-2xl border border-accent/40 p-8 sm:p-12">
          <p className="eyebrow mb-4">For clients abroad</p>
          <h3 className="display text-3xl sm:text-5xl">Remote consultation &amp; fitting</h3>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Style references, measurements and fit requirements are captured virtually before production, then the finished
            garment is delivered internationally. Distance changes nothing about the fit.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────── Journey + Academy ───────────── */
const roles = [
  {
    when: "2022 — Present",
    co: "Astral Couture",
    role: "Founder & Lead Fashion Designer",
    where: "Ibadan, Nigeria",
    pts: [
      "Leads a bespoke and ready-to-wear label (rebranded from Fifi Closet) serving Nigeria and the diaspora.",
      "Delivers end-to-end production in-house: consultation, measurement, drafting, cutting, construction, fitting and finishing.",
      "Applies advanced corsetry to bridal and evening pieces; produces party wear, aso-ebi, blazers, Adire and two-piece sets.",
      "Runs a practical fashion training programme: 8 trained, 4 graduated to date.",
    ],
  },
  {
    when: "2020 — 2022",
    co: "Fifi Closet",
    role: "Founder & Fashion Designer",
    where: "Nigeria",
    pts: [
      "Launched a ready-to-wear business: designing, sewing and selling garments directly to customers.",
      "Added Adire clothing and fabrics, offering indigenous Nigerian textiles alongside finished garments.",
    ],
  },
];

export function Journey() {
  return (
    <section id="journey" className="mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHead
        eyebrow="The Journey"
        title={
          <>
            Six years, <span className="italic text-accent">one needle</span>
          </>
        }
      />
      <div className="grid gap-8 lg:grid-cols-2">
        {roles.map((r, i) => (
          <Reveal key={r.co} delay={i * 0.12}>
            <article className="h-full rounded-2xl border border-line bg-surface p-8 transition duration-500 hover:-translate-y-1 hover:border-accent sm:p-10">
              <p className="text-xs tracking-[0.3em] text-accent">{r.when}</p>
              <h3 className="display mt-4 text-4xl">{r.co}</h3>
              <p className="mt-1 text-muted">
                {r.role} · {r.where}
              </p>
              <div className="stitch my-7" />
              <ul className="space-y-4 text-muted">
                {r.pts.map((p) => (
                  <li key={p} className="flex gap-3 leading-relaxed">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 grid items-center gap-6 rounded-2xl bg-ink p-10 text-bg sm:grid-cols-[1fr_auto] sm:p-14">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] opacity-60">Mentorship</p>
          <h3 className="display text-3xl sm:text-5xl">Teaching the next generation of designers</h3>
          <p className="mt-4 max-w-2xl opacity-70">
            Garment construction, sewing techniques, pattern drafting and production, taught through a structured, practical
            programme.
          </p>
        </div>
        <div className="display text-6xl sm:text-8xl">
          8<span className="text-2xl opacity-60"> trained</span>
        </div>
      </Reveal>
    </section>
  );
}

/* ───────────── Contact ───────────── */
export function PhoneIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 4h3.5l1.8 4.5-2.3 1.5a11 11 0 0 0 6 6l1.5-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6.2L20.5 7" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const contacts: { l: string; v: string; h: string; icon?: React.ReactNode }[] = [
  { l: "WhatsApp / Call", v: "0901 887 5478", h: "tel:+2349018875478", icon: <PhoneIcon /> },
  { l: "Email", v: "eidowu37@gmail.com", h: "mailto:eidowu37@gmail.com", icon: <MailIcon /> },
  { l: "Instagram", v: "@_astralcouture", h: "https://instagram.com/_astralcouture", icon: <InstagramIcon /> },
  { l: "TikTok", v: "@astralcouture", h: "https://tiktok.com/@astralcouture", icon: <TikTokIcon /> },
];

export function Contact() {
  return (
    <section id="contact" className="grain relative overflow-hidden bg-bg-alt px-6 py-28 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <Image src={photos.taupeSuit} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-accent/60" style={{ objectPosition: "50% 18%" }} />
            <p className="eyebrow">Begin with Esther</p>
          </div>
          <h2 className="display max-w-4xl text-5xl leading-[1] sm:text-8xl">
            Let&apos;s make something <span className="italic text-accent">that fits.</span>
          </h2>
          <p className="mt-8 max-w-xl text-lg text-muted">
            Tell Esther about the occasion. Based in Ibadan, serving Nigeria and the diaspora, with remote consultations
            available.
          </p>
          <p className="display mt-8 max-w-xl text-2xl italic text-ink">
            &ldquo;It fits. Perfectly.&rdquo; <span className="text-base not-italic text-muted">— a client, on WhatsApp</span>
          </p>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {contacts.map((c, i) => (
            <Reveal key={c.l} delay={i * 0.07} y={14} className="bg-bg">
              <a href={c.h} target={c.h.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center justify-between p-8 transition hover:bg-surface sm:p-10">
                <div className="flex items-center gap-5">
                  {c.icon && (
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line text-accent transition group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                      {c.icon}
                    </span>
                  )}
                  <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">{c.l}</p>
                  <p className="display mt-2 text-2xl text-ink transition group-hover:text-accent sm:text-3xl">{c.v}</p>
                  </div>
                </div>
                <span className="text-2xl text-accent transition-transform group-hover:translate-x-2">→</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <span className="display flex items-center gap-3 text-xl text-ink">
          <Image src={logo} alt="" width={44} height={44} className="h-11 w-11 rounded-full ring-1 ring-accent/60" />
          <span>
            Astral <span className="italic text-accent">Couture</span>
          </span>
        </span>
        <span className="flex items-center gap-4">
          <a href="https://instagram.com/_astralcouture" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:text-accent">
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a href="https://tiktok.com/@astralcouture" target="_blank" rel="noreferrer" aria-label="TikTok" className="transition hover:text-accent">
            <TikTokIcon className="h-5 w-5" />
          </a>
        </span>
        <span>© 2026 Idowu Omowunmi Esther · Ibadan, Oyo State, Nigeria</span>
      </div>
    </footer>
  );
}
