import { MotionConfig } from "framer-motion";
import Hero from "@/components/Hero";
import Reviews from "@/components/Reviews";
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
        <About />
        <Craft />
        <Corsetry />
        <Process />
        <Journey />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
