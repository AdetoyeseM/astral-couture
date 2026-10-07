import type { StaticImageData } from "next/image";
import blackCapeGown from "@/assets/works/black-cape-gown.jpg";
import pearlLaceDress from "@/assets/works/pearl-lace-dress.jpg";
import pinkLaceCorset from "@/assets/works/pink-lace-corset.jpg";
import redGoldBrocade from "@/assets/works/red-gold-brocade.jpg";
import aquaLaceCorset from "@/assets/works/aqua-lace-corset.jpg";
import pinkSequinStudio from "@/assets/works/pink-sequin-studio.jpg";
import taupeSuit from "@/assets/works/taupe-suit.jpg";
import redStuddedSuit from "@/assets/works/red-studded-suit.jpg";
import redStuddedPortrait from "@/assets/works/red-studded-portrait.jpg";
import plaidBlazer from "@/assets/works/plaid-blazer.jpg";
import plaidBlazerDetail from "@/assets/works/plaid-blazer-detail.jpg";

export const FILTERS = ["All", "Occasion", "Tailoring", "Studio", "Motion"] as const;
export type Filter = (typeof FILTERS)[number];
type Tag = Exclude<Filter, "All">;

type Base = { id: string; title: string; note: string; tags: Tag[]; focus: string };
export type Photo = Base & { kind: "photo"; img: StaticImageData };
export type Clip = Base & { kind: "video"; src: string; poster: string; w: number; h: number; hero: boolean };
export type Work = Photo | Clip;

const photo = (id: string, img: StaticImageData, title: string, note: string, tags: Tag[], focus = "50% 30%"): Photo => ({ kind: "photo", id, img, title, note, tags, focus });
const clip = (id: string, w: number, h: number, title: string, note: string, tags: Tag[], hero = true, focus = "50% 40%"): Clip => ({
  kind: "video",
  id,
  src: `/works/${id}.mp4`,
  poster: `/works/${id}.jpg`,
  w,
  h,
  title,
  note,
  tags: [...tags, "Motion"],
  hero,
  focus,
});

/** Exported by name so other sections (e.g. The Craft) can reuse the same photographs. */
export const photos = {
  blackCapeGown,
  pearlLaceDress,
  pinkLaceCorset,
  redGoldBrocade,
  aquaLaceCorset,
  pinkSequinStudio,
  taupeSuit,
  redStuddedSuit,
  redStuddedPortrait,
  plaidBlazer,
  plaidBlazerDetail,
};

const P = {
  blackCape: photo("black-cape-gown", blackCapeGown, "Beaded column gown with floating cape", "A hand-beaded asymmetric bodice over a clean column skirt, finished with a sweeping cape panel.", ["Occasion"], "50% 28%"),
  pearl: photo("pearl-lace-dress", pearlLaceDress, "Pearl-crowned lace sheath", "A pearl-encrusted bodice with puffed lace sleeves and a draped lace skirt.", ["Occasion"], "50% 35%"),
  pinkLace: photo("pink-lace-corset", pinkLaceCorset, "Pink lace, corseted waist", "Sheer-sleeved lace, a structured bodice and a wrapped, gathered skirt.", ["Occasion"], "50% 35%"),
  brocade: photo("red-gold-brocade", redGoldBrocade, "Red & gold brocade, mermaid cut", "Flared bell sleeves and a fitted mermaid line with a side slit.", ["Occasion"], "40% 50%"),
  aqua: photo("aqua-lace-corset", aquaLaceCorset, "Aqua lace, sweetheart bodice", "A structured sweetheart bodice, sheer lace sleeves and a draped lace skirt.", ["Occasion"], "50% 50%"),
  pinkSequin: photo("pink-sequin-studio", pinkSequinStudio, "Beaded fringe bodice, sequin mermaid skirt", "Fresh off the mannequin in the Astral Couture studio.", ["Occasion", "Studio"], "50% 45%"),
  taupe: photo("taupe-suit", taupeSuit, "The designer, in taupe", "Idowu Esther in a soft-shouldered blazer and high-waisted, pleated trousers, tape measure at her neck.", ["Tailoring"], "50% 30%"),
  redSuit: photo("red-studded-suit", redStuddedSuit, "Crystal-studded red suit", "A fitted red blazer with hand-set crystal detail and wide-leg trousers.", ["Tailoring"], "50% 25%"),
  redPortrait: photo("red-studded-portrait", redStuddedPortrait, "Crystal-studded lapels", "Hand-set crystals following the line of the lapel and shoulder.", ["Tailoring"], "50% 30%"),
  plaid: photo("plaid-blazer", plaidBlazer, "Plaid tailoring in red & white", "A sharp lapel, a defined waist and checks matched across the seams.", ["Tailoring"], "50% 30%"),
  plaidDetail: photo("plaid-blazer-detail", plaidBlazerDetail, "Plaid, in detail", "A structured sleeve, flap pockets and a single-button close.", ["Tailoring"], "50% 30%"),
};

const V = {
  greenBeaded: clip("green-beaded-set", 576, 1024, "Hand-beaded green set", "Details that speak for themselves: a beaded bodice, fringe and a fitted skirt.", ["Occasion", "Studio"]),
  peplum: clip("party-peplum", 464, 832, "Peplum, in motion", "A magenta peplum with embroidered lace, worn at the celebration.", ["Occasion"]),
  robe: clip("green-robe-corset", 480, 848, "Lime satin, beaded corset waist", "Wide satin sleeves over a smocked and beaded corseted waist.", ["Occasion"]),
  ankara: clip("ankara-set", 576, 1024, "Lace top, patterned panel", "A black lace-sleeved top with a patterned, panelled bottom.", ["Occasion"]),
  fringe: clip("pink-fringe", 480, 848, "Pink fringe corset dress", "Beaded fringe and sequins over a boned, fitted bodice.", ["Occasion"]),
  taupeFitting: clip("taupe-suit-fitting", 576, 1024, "Taupe suit, fitting day", "Trying the two-piece on the studio floor.", ["Tailoring", "Studio"]),
  bluePeplum: clip("blue-peplum-street", 576, 1024, "Pale-blue puff-sleeve dress", "Structured puff sleeves over a fitted skirt.", ["Occasion"], false),
  corsetGown: clip("corset-gown-studio", 720, 1280, "Lace-up corset back", "A contoured, lace-up back and a draped skirt, mid-fitting.", ["Occasion", "Studio"]),
};

/** Interleaved so photos and motion alternate down the page. */
export const works: Work[] = [
  P.blackCape,
  V.greenBeaded,
  P.taupe,
  P.pinkLace,
  V.peplum,
  P.redSuit,
  V.corsetGown,
  P.aqua,
  P.pearl,
  V.ankara,
  P.plaid,
  V.fringe,
  P.brocade,
  P.redPortrait,
  V.robe,
  P.pinkSequin,
  V.taupeFitting,
  P.plaidDetail,
  V.bluePeplum,
];

/** Clips used for the homepage underlay (clean frames, no burned-in text). */
export const heroClips: Clip[] = works.filter((w): w is Clip => w.kind === "video" && w.hero);
