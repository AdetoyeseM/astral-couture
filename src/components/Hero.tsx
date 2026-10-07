"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import HeroVideo from "./HeroVideo";
import { heroReview } from "./Reviews";
import { rise, stagger } from "./ui";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.05 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative isolate min-h-[100svh] overflow-hidden bg-black text-white">
      <HeroVideo active={inView} scroll={scrollYProgress} />

      <div className="grain pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-6 pb-36 pt-28">
        <motion.div style={{ y: yText, opacity: fade }} variants={stagger} initial="hidden" animate="show" className="max-w-5xl">
          <motion.p variants={rise} className="eyebrow mb-7 !text-[var(--gold-lit)]">
            Ibadan, Nigeria &nbsp;·&nbsp; Serving clients worldwide
          </motion.p>
          <motion.h1 variants={rise} className="display text-[3.2rem] leading-[0.98] [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-[5.6rem]">
            Cut with <span className="italic text-[var(--gold-lit)]">precision.</span>
            <br />
            Sewn to be <span className="italic">remembered.</span>
          </motion.h1>
          <motion.p variants={rise} className="mt-7 max-w-xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            Astral Couture is a bespoke, bridal and ready-to-wear label by Idowu Esther. Every garment is drafted, cut,
            fitted and finished in-house, with advanced corsetry that holds the shape you imagined.
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#contact" className="rounded-full bg-[var(--gold-lit)] px-8 py-4 text-sm tracking-wide text-black transition hover:opacity-85">
              Commission a piece
            </a>
            <a href="#works" className="group flex items-center gap-3 px-4 py-4 text-sm tracking-wide">
              See the work
              <span className="inline-block transition-transform group-hover:translate-x-1.5">→</span>
            </a>
          </motion.div>
          <motion.a variants={rise} href="#reviews" className="group mt-10 hidden max-w-lg sm:block border-l-2 border-[var(--gold-lit)] pl-5">
            <p className="display text-2xl italic leading-snug">&ldquo;{heroReview.q}&rdquo;</p>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/60 transition group-hover:text-[var(--gold-lit)]">
              {heroReview.by} &nbsp;→&nbsp; Read the reviews
            </p>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
