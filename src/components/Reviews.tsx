"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal, SectionHead } from "./ui";
import packageReceived from "@/assets/reviews/package-received.jpg";
import peopleAsk from "@/assets/reviews/people-ask.jpg";
import fitsPerfectly from "@/assets/reviews/fits-perfectly.jpg";
import materials from "@/assets/reviews/materials.jpg";
import brandedPackage from "@/assets/reviews/branded-package.jpg";
import loveMyDress from "@/assets/reviews/love-my-dress.jpg";

/* ───────────── Review content ───────────── */
export const heroReview = {
  q: "Exactly what I was expecting. No disappointment.",
  by: "Client, on receiving her package",
};

const quotes = [
  { q: "It fits. Perfectly.", by: "Client, after tying her gele", note: "" },
  { q: "Exactly what I was expecting. No disappointment.", by: "Client, on receiving her package", note: "" },
  { q: "The materials are quality.", by: "Client, after checking her order", note: "" },
  { q: "People don dey ask for my tailor oo.", by: "Returning client", note: "People keep asking who made this." },
];

const shots: { src: StaticImageData; alt: string; label: string }[] = [
  {
    src: fitsPerfectly,
    alt: "WhatsApp message from a client wearing a green and gold aso-ebi dress: “This was before I tied gele. It fits. Perfectly.”",
    label: "“It fits. Perfectly.”",
  },
  {
    src: packageReceived,
    alt: "WhatsApp message from a client: “Have received my package. Yes, it’s so nice. Exactly what I was expecting, no disappointment.”",
    label: "“No disappointment.”",
  },
  {
    src: materials,
    alt: "WhatsApp message from a client who found a free gift in her order: “D materials re quality.” Astral Couture replies, “We don’t do fake.”",
    label: "“We don’t do fake.”",
  },
  {
    src: peopleAsk,
    alt: "WhatsApp message from a client: “People don dey ask for my tailor oo. I go bring dem.”",
    label: "“I go bring dem.”",
  },
  {
    src: loveMyDress,
    alt: "WhatsApp message from a client in a white dress with puffed lace sleeves: “Thank you. I love my dress.” Astral Couture replies, “I’m glad you do ma. Thank you ma.”",
    label: "“I love my dress.”",
  },
  {
    src: brandedPackage,
    alt: "A client’s photo of her delivered Astral Couture package in branded packaging: “Package received with thanks.”",
    label: "“Package received with thanks.”",
  },
];

/* ───────────── Lightbox ───────────── */
function Lightbox({ i, onClose }: { i: number | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [i, onClose]);

  return (
    <AnimatePresence>
      {i !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={shots[i].label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full overflow-auto rounded-2xl"
          >
            <Image src={shots[i].src} alt={shots[i].alt} sizes="(max-width: 640px) 92vw, 560px" className="h-auto max-h-[88vh] w-auto max-w-full" />
          </motion.div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/30 text-xl text-white transition hover:bg-white hover:text-black"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────── Section ───────────── */
export default function Reviews() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="reviews" className="bg-bg-alt px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          eyebrow="Kind Words"
          title={
            <>
              Reviews <span className="italic text-accent">don&apos;t lie</span>
            </>
          }
          lead="Unedited messages from clients, sent after their pieces arrived. A good fit gets talked about."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quotes.map((c, i) => (
            <Reveal key={c.q} delay={i * 0.08} className="h-full">
              <figure className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-8 transition duration-500 hover:-translate-y-1 hover:border-accent">
                <span aria-hidden className="display absolute -right-1 -top-6 text-9xl leading-none text-accent/20">
                  &rdquo;
                </span>
                <blockquote className="relative">
                  <p className="display text-3xl leading-tight">{c.q}</p>
                  {c.note && <p className="mt-3 text-sm italic text-muted">{c.note}</p>}
                </blockquote>
                <figcaption className="relative mt-8">
                  <div className="stitch mb-4" />
                  <p className="text-xs uppercase tracking-[0.25em] text-muted">{c.by}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mb-8 mt-24 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">Receipts</p>
            <h3 className="display text-3xl sm:text-5xl">
              Straight from <span className="italic text-accent">WhatsApp</span>
            </h3>
          </div>
          <p className="hidden max-w-xs text-sm text-muted sm:block">Tap any message to read it in full.</p>
        </Reveal>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {shots.map((s, i) => (
            <Reveal key={s.label} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              <button
                onClick={() => setOpen(i)}
                aria-label={`Open review: ${s.label}`}
                className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-surface text-left transition duration-500 hover:border-accent"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  placeholder="blur"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 380px"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-5 pb-4 pt-10 text-sm text-white transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  {s.label}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox i={open} onClose={() => setOpen(null)} />
    </section>
  );
}
