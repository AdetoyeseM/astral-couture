"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { heroReview } from "./Reviews";
import { rise, stagger } from "./ui";

const draw = (i: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: 0.4 + i * 0.18, duration: 1.8, ease: "easeInOut" as const }, opacity: { delay: 0.4 + i * 0.18, duration: 0.2 } },
  },
});

const solid = [
  "M150 62 C150 40 250 40 250 62",
  "M150 62 C122 70 98 84 92 112",
  "M250 62 C278 70 302 84 308 112",
  "M92 112 C102 172 122 212 126 256 C130 306 102 356 88 424",
  "M308 112 C298 172 278 212 274 256 C270 306 298 356 312 424",
  "M88 424 C160 446 240 446 312 424",
  "M136 164 C150 210 192 210 199 164",
  "M264 164 C250 210 208 210 201 164",
];
const seams = [
  "M166 84 C150 160 160 222 166 272 C170 332 152 386 142 436",
  "M234 84 C250 160 240 222 234 272 C230 332 248 386 258 436",
  "M200 96 L200 438",
  "M124 258 C170 274 230 274 276 258",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yForm = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} id="top" className="grain relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }}
      />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div style={{ y: yText }} variants={stagger} initial="hidden" animate="show">
          <motion.p variants={rise} className="eyebrow mb-7">
            Ibadan, Nigeria &nbsp;·&nbsp; Serving clients worldwide
          </motion.p>
          <motion.h1 variants={rise} className="display text-[3.2rem] leading-[0.98] sm:text-7xl lg:text-[6.4rem]">
            Cut with <span className="italic text-accent">precision.</span>
            <br />
            Sewn to be <span className="italic">remembered.</span>
          </motion.h1>
          <motion.p variants={rise} className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
            Astral Couture is a bespoke, bridal and ready-to-wear label by Idowu Esther. Every garment is drafted, cut,
            fitted and finished in-house, with advanced corsetry that holds the shape you imagined.
          </motion.p>
          <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="rounded-full bg-accent px-8 py-4 text-sm tracking-wide text-bg transition hover:opacity-85">
              Commission a piece
            </a>
            <a href="#craft" className="group flex items-center gap-3 px-4 py-4 text-sm tracking-wide">
              See the craft
              <span className="inline-block transition-transform group-hover:translate-x-1.5">→</span>
            </a>
          </motion.div>
          <motion.a variants={rise} href="#reviews" className="group mt-12 block max-w-md border-l-2 border-accent pl-5">
            <p className="display text-2xl italic leading-snug">&ldquo;{heroReview.q}&rdquo;</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted transition group-hover:text-accent">
              {heroReview.by} &nbsp;→&nbsp; Read the reviews
            </p>
          </motion.a>
        </motion.div>

        <motion.div style={{ y: yForm }} className="relative mx-auto w-full max-w-[420px]">
          <motion.svg
            viewBox="0 0 400 560"
            fill="none"
            initial="hidden"
            animate="show"
            className="w-full text-ink"
            role="img"
            aria-label="Line drawing of a corseted bodice on a dress form"
          >
            {solid.map((d, i) => (
              <motion.path key={d} d={d} variants={draw(i)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ))}
            {seams.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                variants={draw(i + 6)}
                stroke="var(--accent)"
                strokeWidth="1.4"
                strokeDasharray="5 6"
                strokeLinecap="round"
              />
            ))}
            <motion.path d="M200 446 L200 520 M140 534 C170 522 230 522 260 534" variants={draw(10)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            {/* eyelets down the back-lacing line */}
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.circle
                key={i}
                cx="200"
                cy={120 + i * 34}
                r="3"
                fill="var(--accent)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.4 + i * 0.08, type: "spring", stiffness: 300 }}
              />
            ))}
          </motion.svg>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
            className="eyebrow absolute -left-2 top-[46%] hidden -rotate-90 origin-left text-[0.62rem] sm:block"
          >
            Waist · drafted to measure
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-muted md:flex"
      >
        Scroll
        <motion.span animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="block h-10 w-px origin-top bg-accent" />
      </motion.div>
    </section>
  );
}
