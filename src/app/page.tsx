import { MotionConfig } from "framer-motion";
import Academy from "@/components/Academy";
import Hero from "@/components/Hero";
import Reviews from "@/components/Reviews";
import Works from "@/components/Works";
import { Nav, TapeProgress } from "@/components/ui";
import { About, Contact, Corsetry, Craft, Footer, Journey, Marquee, Process } from "@/components/Sections";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <TapeProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Works />
        <About />
        <Craft />
        <Corsetry />
        <Process />
        <Academy />
        <Journey />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
