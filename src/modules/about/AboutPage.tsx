import Chatbot from "@/components/Elements/Chatbot";
import Footer from "@/components/Elements/Footer";
import Intro from "@/modules/home/components/Intro";

export default function AboutPage() {
  return (
    <>
      <main className="bg-neutral-1 w-full min-h-screen flex flex-col justify-center overflow-x-hidden">
        <Intro isCompleteVersion={true} />
        <Footer />
        <Chatbot />
      </main>
    </>
  );
}
