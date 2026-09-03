import Chatbot from "@/components/Elements/Chatbot";
import Footer from "@/components/Elements/Footer";
import Hero from "@/modules/home/components/Hero";
import Intro from "@/modules/home/components/Intro";
import Projects from "@/modules/home/components/Projects";
import Solutions from "@/modules/home/components/Solutions";
import Testimony from "@/modules/home/components/Testimony";

export default function Home() {
  return (
    <>
      <main className="bg-neutral-1 w-full min-h-screen flex flex-col justify-center overflow-x-hidden">
        <Hero />
        <Intro isCompleteVersion={false} />
        <Projects />
        <Solutions />
        <Testimony />
        <Footer />
        <Chatbot />
      </main>
    </>
  );
}
