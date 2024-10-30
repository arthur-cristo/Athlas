import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default async function Home() {

  return (
    <div className="bg-dark_gray-gradient md:h-screen">
      <Header />
      <Hero />
    </div>
  );
}
