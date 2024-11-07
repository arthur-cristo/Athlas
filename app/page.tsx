import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default async function Home() {

  return (
    <div className="bg-very_dark_gray min-h-screen">
      <Header />
      <Hero />
    </div>
  );
}
