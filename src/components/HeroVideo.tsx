"use client";

import { AnimatePresence, motion, motionValue, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { heroClips, type Clip } from "@/lib/works";

/* ───────────── Tunables ───────────── */
const SEG = 6.8; // seconds a clip owns its panel before the next one fades in
const FADE = 1.2; // crossfade, seconds. A clip must outlast SEG + FADE (all hero clips are ≥ 9s)
const CLIP_ASPECT = 9 / 16; // the shoot format: every clip is portrait
const MAX_COLS = 5;
const PHI = 0.6180339887; // golden-ratio stagger so panels never move in lockstep

/**
 * How many portrait panels tile this viewport with the least cropping?
 * Minimises |ln(panelAspect / clipAspect)|, so a 1440×900 screen gets three
 * near-native 9:16 panels, a phone gets one, and an ultrawide gets four.
 */
function bestCols(w: number, h: number) {
  let best = 1;
  let bestErr = Infinity;
  for (let c = 1; c <= Math.min(MAX_COLS, heroClips.length); c++) {
    const err = Math.abs(Math.log(w / c / h / CLIP_ASPECT));
    if (err < bestErr) {
      best = c;
      bestErr = err;
    }
  }
  return best;
}

const subscribeResize = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};
const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};
const noopSubscribe = () => () => {};

type Shown = { clip: Clip; n: number };

/** Next clip in the loop that no other panel is showing right now. */
function pickNext(from: number, col: number, taken: (col: number, id: string) => boolean) {
  const K = heroClips.length;
  for (let k = 1; k <= K; k++) {
    const i = (from + k) % K;
    if (!taken(col, heroClips[i].id)) return i;
  }
  return (from + 1) % K;
}

function load(v: HTMLVideoElement, c: Clip, onMeta?: () => void) {
  v.muted = true;
  v.preload = "auto";
  v.src = c.src;
  if (onMeta) v.addEventListener("loadedmetadata", onMeta, { once: true });
  v.load();
}

/* ───────────── One panel: two stacked <video>s, crossfaded ───────────── */
function Column({
  col,
  cols,
  active,
  animated,
  scroll,
  pointerX,
  claim,
  taken,
  onShow,
  onProgress,
}: {
  col: number;
  cols: number;
  active: boolean;
  animated: boolean;
  scroll: MotionValue<number>;
  pointerX: MotionValue<number>;
  claim: (col: number, id: string | null) => void;
  taken: (col: number, id: string) => boolean;
  onShow: (col: number, s: Shown) => void;
  onProgress: (col: number, p: number) => void;
}) {
  const K = heroClips.length;
  const startPos = Math.floor((col * K) / cols) % K;
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const st = useRef({ pos: startPos, next: startPos, front: 0 as 0 | 1, startAt: 0, swapping: false, n: 0 });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [front, setFront] = useState<0 | 1>(0);
  const [settled, setSettled] = useState(true);

  // Depth: outer panels drift further than the middle one.
  const depth = 10 + (col % 3) * 6;
  const x = useTransform(pointerX, [-1, 1], [-depth, depth]);
  const y = useTransform(scroll, [0, 1], [0, (col % 2 ? 1 : -1) * 38]);

  // Load the first two clips for this panel.
  useEffect(() => {
    if (!animated) {
      onShow(col, { clip: heroClips[startPos], n: 0 });
      return;
    }
    const v0 = a.current;
    const v1 = b.current;
    if (!v0 || !v1) return;
    const s = st.current;
    claim(col, heroClips[s.pos].id);
    load(v0, heroClips[s.pos], () => {
      // Desynchronise panels: each starts a different distance into its first clip.
      const room = Math.max(0, v0.duration - (SEG + FADE + 0.25));
      s.startAt = Math.min(room, ((col * PHI) % 1) * 2.2);
      v0.currentTime = s.startAt;
    });
    s.next = pickNext(s.pos, col, taken);
    load(v1, heroClips[s.next]);
    onShow(col, { clip: heroClips[s.pos], n: ++s.n });
    return () => {
      clearTimeout(timer.current);
      claim(col, null);
      for (const v of [v0, v1]) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
    };
  }, [animated, col, startPos, claim, taken, onShow]);

  // Run the schedule only while the hero is on screen and the tab is visible.
  useEffect(() => {
    if (!animated) return;
    const vids = [a.current, b.current];
    const s = st.current;
    if (!vids[0] || !vids[1]) return;
    const pair = vids as HTMLVideoElement[];
    if (!active) {
      pair.forEach((v) => v.pause());
      return;
    }
    const play = (v: HTMLVideoElement) => void v.play().catch(() => {});
    play(pair[s.front]);
    if (s.swapping) play(pair[1 - s.front]);

    const swap = () => {
      const incoming = pair[1 - s.front];
      const outgoing = pair[s.front];
      if (incoming.readyState < 3) return; // not buffered yet; try again next frame
      s.swapping = true;
      incoming.currentTime = 0;
      play(incoming);
      s.front = (1 - s.front) as 0 | 1;
      s.startAt = 0;
      s.pos = s.next;
      claim(col, heroClips[s.pos].id);
      setFront(s.front);
      setSettled(false);
      onShow(col, { clip: heroClips[s.pos], n: ++s.n });
      timer.current = setTimeout(() => {
        outgoing.pause();
        s.next = pickNext(s.pos, col, taken);
        load(outgoing, heroClips[s.next]);
        s.swapping = false;
        setSettled(true);
      }, (FADE + 0.15) * 1000);
    };

    let raf = 0;
    const tick = () => {
      const cur = pair[s.front];
      const elapsed = cur.currentTime - s.startAt;
      onProgress(col, Math.min(1, Math.max(0, elapsed / SEG)));
      if (!s.swapping && cur.readyState >= 2 && elapsed >= SEG) swap();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, animated, col, claim, taken, onShow, onProgress]);

  const slot = (i: 0 | 1): React.CSSProperties => ({
    // The outgoing clip stays opaque until the incoming one has fully faded in, so there is no mid-fade dip.
    opacity: front === i || !settled ? 1 : 0,
    zIndex: front === i ? 2 : 1,
    transition: front === i ? `opacity ${FADE}s ease` : "none",
    objectPosition: "50% 40%",
  });

  const videoProps = {
    muted: true,
    playsInline: true,
    disablePictureInPicture: true,
    "aria-hidden": true,
    tabIndex: -1,
    className: "absolute inset-0 h-full w-full object-cover",
  } as const;

  return (
    <div className={`relative overflow-hidden bg-black ${col > 0 ? "border-l border-white/10" : ""}`}>
      <motion.div style={animated ? { x, y } : undefined} className="absolute -inset-x-4 -inset-y-[4%]">
        {/* Poster underlay: visible while video buffers, and the only layer when motion is off. */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroClips[startPos].poster})` }} />
        {animated && (
          <>
            <video ref={a} {...videoProps} style={slot(0)} />
            <video ref={b} {...videoProps} style={slot(1)} />
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ───────────── Caption under each panel ───────────── */
function Caption({ shown, progress, animated }: { shown?: Shown; progress: MotionValue<number>; animated: boolean }) {
  const idx = shown ? heroClips.findIndex((c) => c.id === shown.clip.id) + 1 : 0;
  return (
    <div className="px-6 pb-7 pt-10">
      {animated && (
        <div className="h-px w-full bg-white/20">
          <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-[var(--gold-lit)]" />
        </div>
      )}
      <div className="mt-3 h-5 overflow-hidden text-[0.68rem] uppercase tracking-[0.22em] text-white/80">
        <AnimatePresence mode="wait">
          {shown && (
            <motion.p
              key={`${shown.clip.id}-${shown.n}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex items-baseline gap-3 whitespace-nowrap"
            >
              <span className="text-[var(--gold-lit)]">
                {String(idx).padStart(2, "0")}/{String(heroClips.length).padStart(2, "0")}
              </span>
              <span className="truncate">{shown.clip.title}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────── The underlay ───────────── */
export default function HeroVideo({ active, scroll }: { active: boolean; scroll: MotionValue<number> }) {
  const cols = useSyncExternalStore(subscribeResize, () => bestCols(window.innerWidth, window.innerHeight), () => 3);
  const reduce = useReducedMotion();
  const saver = useSyncExternalStore(noopSubscribe, () => !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData, () => false);
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
  const animated = !reduce && !saver;
  const run = active && visible;

  const claims = useRef<(string | null)[]>([]);
  const claim = useCallback((col: number, id: string | null) => void (claims.current[col] = id), []);
  const taken = useCallback((col: number, id: string) => claims.current.some((c, i) => i !== col && c === id), []);
  const progs = useMemo(() => Array.from({ length: MAX_COLS }, () => motionValue(0)), []);
  const onProgress = useCallback((col: number, p: number) => progs[col].set(p), [progs]);
  const [shown, setShown] = useState<(Shown | undefined)[]>([]);
  const onShow = useCallback(
    (col: number, s: Shown) =>
      setShown((prev) => {
        const n = prev.slice();
        n[col] = s;
        return n;
      }),
    [],
  );

  const pointer = useMotionValue(0);
  const pointerX = useSpring(pointer, { stiffness: 60, damping: 18 });
  useEffect(() => {
    if (!animated) return;
    const move = (e: PointerEvent) => pointer.set((e.clientX / window.innerWidth) * 2 - 1);
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [animated, pointer]);

  // Scroll out: the film zooms, softens and dims, handing the page back to the text.
  const scale = useTransform(scroll, [0, 1], [1, 1.1]);
  const filter = useTransform(scroll, [0, 1], ["blur(0px) brightness(1)", "blur(6px) brightness(0.55)"]);

  const grid = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };
  return (
    <>
      <motion.div aria-hidden style={animated ? { scale, filter } : undefined} className="absolute inset-0 grid origin-center" >
        <div className="grid h-full" style={grid}>
          {Array.from({ length: cols }, (_, c) => (
            <Column
              key={`${cols}-${c}`}
              col={c}
              cols={cols}
              active={run}
              animated={animated}
              scroll={scroll}
              pointerX={pointerX}
              claim={claim}
              taken={taken}
              onShow={onShow}
              onProgress={onProgress}
            />
          ))}
        </div>
      </motion.div>

      {/* Dark overlay: an even tint, a left-weighted ramp behind the headline, a vignette, and a faint gold wash for warmth. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#080706]/45" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "linear-gradient(90deg, rgba(8,7,6,0.9) 0%, rgba(8,7,6,0.72) 35%, rgba(8,7,6,0.3) 70%, rgba(8,7,6,0.15) 100%)",
            "linear-gradient(0deg, rgba(8,7,6,0.92) 0%, rgba(8,7,6,0.45) 22%, rgba(8,7,6,0) 45%)",
            "linear-gradient(180deg, rgba(8,7,6,0.7) 0%, rgba(8,7,6,0) 24%)",
            "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{ background: "linear-gradient(135deg, rgba(230,200,135,0.35), rgba(230,200,135,0) 55%)" }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 grid" style={grid}>
        {Array.from({ length: cols }, (_, c) => (
          <Caption key={c} shown={shown[c]} progress={progs[c]} animated={animated} />
        ))}
      </div>
    </>
  );
}
