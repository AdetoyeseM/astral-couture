"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FILTERS, works, type Filter, type Work } from "@/lib/works";
import { Reveal, SectionHead } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");
const ratio = (w: Work) => (w.kind === "photo" ? `${w.img.width} / ${w.img.height}` : `${w.w} / ${w.h}`);

/* ───────────── Tile ───────────── */
function Tile({ w, i, onOpen }: { w: Work; i: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const near = useInView(ref, { margin: "300px 0px" });
  const playing = useInView(ref, { amount: 0.45 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  // Only the clips actually on screen are decoding.
  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (playing && !reduce) void v.play().catch(() => {});
    else v.pause();
  }, [playing, reduce, near]);

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(10% 10% 10% 10% round 18px)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 18px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="mb-3 break-inside-avoid sm:mb-5"
    >
      <button
        ref={ref}
        onClick={onOpen}
        aria-label={`View ${w.title}${w.kind === "video" ? " (video)" : ""}`}
        className="group relative block w-full overflow-hidden rounded-[18px] border border-line bg-surface text-left"
        style={{ aspectRatio: ratio(w) }}
      >
        <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -inset-y-[6%]">
          {w.kind === "photo" ? (
            <Image
              src={w.img}
              alt={`${w.title}. ${w.note}`}
              fill
              placeholder="blur"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: w.focus }}
            />
          ) : (
            <>
              <Image src={w.poster} alt="" fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" style={{ objectPosition: w.focus }} />
              {near && (
                <video
                  ref={vid}
                  src={w.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: w.focus }}
                />
              )}
            </>
          )}
        </motion.div>

        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
          <span className="block text-[0.6rem] uppercase tracking-[0.28em] text-[var(--gold-lit)]">{w.kind === "video" ? "▶ Motion" : w.tags[0]}</span>
          <span className="display mt-1 block text-lg leading-tight sm:text-2xl">{w.title}</span>
          <span className="block max-h-0 overflow-hidden text-xs leading-relaxed text-white/75 opacity-0 transition-all duration-500 group-hover:mt-2 group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:mt-2 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
            {w.note}
          </span>
        </span>
      </button>
    </motion.div>
  );
}

/* ───────────── Viewer (lightbox) ───────────── */
const slide = {
  enter: (d: number) => ({ x: d * 90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d * -90, opacity: 0 }),
};

function Viewer({ items, i, onClose, onGo }: { items: Work[]; i: number | null; onClose: () => void; onGo: (n: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [dir, setDir] = useState(0);
  const n = items.length;

  const go = useCallback(
    (d: number) => {
      if (i === null) return;
      setDir(d);
      onGo((i + d + n) % n);
    },
    [i, n, onGo],
  );

  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [i, go, onClose]);

  const opened = i !== null;
  useEffect(() => {
    if (opened) closeRef.current?.focus();
  }, [opened]);

  const item = i === null ? null : items[i];
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <AnimatePresence>
      {item && i !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title}, ${i + 1} of ${n}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex flex-col bg-black/90 text-white backdrop-blur-md"
        >
          <div className="flex items-center justify-between px-5 py-4" onClick={stop}>
            <span className="text-xs tracking-[0.3em] text-white/70">
              {pad(i + 1)} / {pad(n)}
            </span>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-xl transition hover:bg-white hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.div
                key={item.id}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
                onClick={stop}
                className="flex max-h-full max-w-full items-center justify-center"
              >
                {item.kind === "photo" ? (
                  <Image
                    src={item.img}
                    alt={`${item.title}. ${item.note}`}
                    sizes="(max-width: 640px) 92vw, 70vh"
                    draggable={false}
                    style={{ width: "auto", height: "auto" }}
                    className="max-h-[66vh] max-w-full rounded-2xl"
                  />
                ) : (
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="max-h-[66vh] max-w-full rounded-2xl bg-black"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {(["prev", "next"] as const).map((k) => (
              <button
                key={k}
                onClick={(e) => {
                  stop(e);
                  go(k === "next" ? 1 : -1);
                }}
                aria-label={k === "next" ? "Next piece" : "Previous piece"}
                className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 text-xl transition hover:bg-white hover:text-black sm:grid ${k === "next" ? "right-5" : "left-5"}`}
              >
                {k === "next" ? "→" : "←"}
              </button>
            ))}
          </div>

          <div className="px-6 pb-7 pt-5 text-center" onClick={stop}>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--gold-lit)]">{item.tags.join(" · ")}</p>
            <h3 className="display mt-2 text-3xl sm:text-4xl">{item.title}</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/70">{item.note}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────── Section ───────────── */
export default function Works() {
  const [tag, setTag] = useState<Filter>("All");
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const visible = useMemo(() => works.filter((w) => tag === "All" || w.tags.includes(tag)), [tag]);
  const count = (f: Filter) => (f === "All" ? works.length : works.filter((w) => w.tags.includes(f)).length);
  const films = visible.filter((w) => w.kind === "video").length;

  const show = (i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  return (
    <section id="works" className="mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHead
        eyebrow="Selected Works"
        title={
          <>
            Studio-made, <span className="italic text-accent">worn out loud</span>
          </>
        }
        lead="Occasion wear, structured corsetry and sharp tailoring, from first fitting to final photograph."
      />

      <Reveal className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter works" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = tag === f;
            return (
              <button
                key={f}
                onClick={() => setTag(f)}
                aria-pressed={active}
                className="relative rounded-full border border-line px-5 py-2 text-sm tracking-wide transition hover:border-accent"
              >
                {active && <motion.span layoutId="works-chip" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className={`relative transition-colors ${active ? "text-bg" : "text-muted"}`}>
                  {f} <span className="text-[0.65rem] opacity-70">{count(f)}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {visible.length} pieces{films > 0 && ` · ${films} in motion`}
        </p>
      </Reveal>

      <div key={tag} className="columns-2 gap-3 sm:gap-5 md:columns-3 lg:columns-4">
        {visible.map((w, i) => (
          <Tile key={w.id} w={w} i={i} onOpen={() => show(i)} />
        ))}
      </div>

      <Viewer items={visible} i={open} onClose={close} onGo={setOpen} />
    </section>
  );
}
