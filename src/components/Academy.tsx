"use client";

import { AnimatePresence, motion, motionValue, useInView, useReducedMotion, type MotionValue } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import patternDraft from "@/assets/academy/pattern-draft.jpg";
import { Reveal, SectionHead } from "./ui";

/* ───────────── Content ───────────── */
const TRACKS = ["Drafting", "Training", "Making"] as const;
type Track = (typeof TRACKS)[number];

type Lesson = { id: string; track: Track; title: string; note: string; length: string } & (
  | { kind: "video"; src: string; poster: string; zoom?: boolean }
  | { kind: "photo" }
);

const video = (id: string, track: Track, title: string, note: string, length: string, zoom = false): Lesson => ({
  id,
  track,
  title,
  note,
  length,
  kind: "video",
  src: `/academy/${id}.mp4`,
  poster: `/academy/${id}.jpg`,
  zoom,
});

const lessons: Lesson[] = [
  video("drafting-wall", "Drafting", "Drafting at full scale", "Trainees pin the draft to the wall and mark it out at full scale, line by line.", "0:15"),
  video("drafting-hands", "Drafting", "Pattern drafting, by hand", "A straight edge, a French curve and a measured line: every block starts on paper.", "0:14"),
  video("pattern-pieces", "Drafting", "Pieces, ready to cut", "Drafted pieces laid out and checked on the table before a single cut is made.", "0:09"),
  { id: "pattern-draft", track: "Drafting", title: "Draft in progress", note: "A trouser block drafted to measure, with its waist, hip, crotch and thigh lines, tracing paper and class notes alongside.", length: "Photo", kind: "photo" },
  video("lesson-walkthrough", "Training", "The walk-through", "The instructor talks the class through a drafted pattern piece before they cut their own.", "0:14"),
  video("lesson-marking", "Training", "Marking and measuring", "Trainees follow along, pen in hand, as marking and folding are demonstrated at the table.", "0:14"),
  video("cloth-to-dress", "Making", "From cloth to finished dress", "A pattern traced on satin, cut, stitched and finished: a puff-sleeve dress from first mark to mannequin.", "0:15", true),
  video("fit-check", "Making", "Fit check, every angle", "A fitted white dress checked from the front, side and back before it is signed off.", "0:16"),
];

const taught = [
  ["Pattern drafting", "From measurements to paper, at full scale."],
  ["Garment construction", "Structure, seams and finishing."],
  ["Sewing techniques", "Machine and hand, taught step by step."],
  ["Production", "Planning a piece from first line to final press."],
];

/* ───────────── Stage: the framed player ───────────── */
function Stage({ lesson, active, progress }: { lesson: Lesson; active: boolean; progress: MotionValue<number> }) {
  const vid = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const run = active && !paused && !reduce;

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    if (run) void v.play().catch(() => {});
    else v.pause();
  }, [run, lesson.id]);

  // Frame-accurate progress for the active row, driven by the video's own clock.
  useEffect(() => {
    progress.set(0);
    if (lesson.kind !== "video" || !run) return;
    let raf = 0;
    const tick = () => {
      const v = vid.current;
      if (v && v.duration) progress.set(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lesson, run, progress]);

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* measuring-tape edge */}
      <div aria-hidden className="ruler-y absolute -left-5 bottom-0 top-0 hidden w-4 sm:block" />
      {/* corner brackets */}
      {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
        <span key={c} aria-hidden className={`pointer-events-none absolute z-10 h-6 w-6 border-[var(--gold-lit)] ${c} m-2`} />
      ))}

      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-line bg-black">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {lesson.kind === "video" ? (
              <video
                ref={vid}
                src={lesson.src}
                poster={lesson.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={lesson.title}
                className={`h-full w-full object-cover ${lesson.zoom ? "origin-bottom scale-[1.08]" : ""}`}
              />
            ) : (
              <Image src={patternDraft} alt="A drafted pattern on large paper, with a French curve, a notebook and an eraser" placeholder="blur" sizes="380px" className="h-full w-full object-cover" />
            )}
          </motion.div>
        </AnimatePresence>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 text-white">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.28em] text-[var(--gold-lit)]">{lesson.track}</p>
            <p className="display mt-1 text-2xl leading-tight">{lesson.title}</p>
          </div>
          {lesson.kind === "video" && (
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play video" : "Pause video"}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 text-sm transition hover:bg-white hover:text-black"
            >
              {paused || reduce ? "▶" : "❚❚"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Section ───────────── */
export default function Academy() {
  const [track, setTrack] = useState<Track>("Drafting");
  const [id, setId] = useState(lessons[0].id);
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.25 });
  const progress = useMemo(() => motionValue(0), []);

  const list = lessons.filter((l) => l.track === track);
  const lesson = lessons.find((l) => l.id === id) ?? list[0];

  const pick = (t: Track) => {
    setTrack(t);
    setId(lessons.find((l) => l.track === t)!.id);
  };

  return (
    <section id="academy" className="mx-auto max-w-7xl px-6 py-28 sm:py-36">
      <SectionHead
        eyebrow="Academy & Drafting"
        title={
          <>
            Where patterns begin, <span className="italic text-accent">and designers</span> are made
          </>
        }
        lead="Every garment starts as lines on paper. Esther teaches that discipline to the next generation of designers, in a structured, practical programme at the Ibadan studio."
      />

      <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Choose a track" className="flex flex-wrap gap-2">
          {TRACKS.map((t) => {
            const on = track === t;
            return (
              <button key={t} onClick={() => pick(t)} aria-pressed={on} className="relative rounded-full border border-line px-5 py-2 text-sm tracking-wide transition hover:border-accent">
                {on && <motion.span layoutId="academy-chip" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className={`relative transition-colors ${on ? "text-bg" : "text-muted"}`}>
                  {t} <span className="text-[0.65rem] opacity-70">{lessons.filter((l) => l.track === t).length}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted">8 trained · 4 graduated</p>
      </Reveal>

      <Reveal className="blueprint rounded-3xl border border-line p-5 sm:p-8 lg:p-12">
        <div className="grid items-start gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          <div ref={stageRef} className="lg:sticky lg:top-28">
            <Stage lesson={lesson} active={inView} progress={progress} />
          </div>

          <ol className="divide-y divide-line border-y border-line bg-surface/70 backdrop-blur-[1px]">
            {list.map((l, k) => {
              const on = l.id === lesson.id;
              return (
                <li key={l.id}>
                  <button onClick={() => setId(l.id)} aria-current={on} className="group block w-full px-4 py-6 text-left sm:px-6">
                    <span className="flex items-baseline gap-4 sm:gap-6">
                      <span className={`text-xs tracking-[0.3em] transition-colors ${on ? "text-accent" : "text-muted"}`}>{String(k + 1).padStart(2, "0")}</span>
                      <span className={`display flex-1 text-2xl transition-all duration-300 sm:text-3xl ${on ? "translate-x-1 text-accent" : "text-ink group-hover:translate-x-1"}`}>{l.title}</span>
                      <span className="text-xs tracking-[0.2em] text-muted">{l.length}</span>
                    </span>
                    <span className="mt-3 block max-w-xl pl-[calc(2ch+1rem)] text-sm leading-relaxed text-muted sm:pl-[calc(2ch+1.5rem)]">{l.note}</span>
                    <span className="mt-4 block h-px w-full bg-line">
                      {on && <motion.span style={{ scaleX: progress }} className="block h-px origin-left bg-accent" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {taught.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.07} y={16} className="bg-bg p-8">
            <p className="text-xs tracking-[0.3em] text-accent">0{i + 1}</p>
            <h3 className="display mt-3 text-2xl">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
