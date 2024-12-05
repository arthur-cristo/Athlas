'use client'

import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import heroImage from "@/public/assets/images/hero_image.avif"
import { useUser } from "@/app/UserContext";

const Hero = () => {

  const user = useUser();

  const features = [
    "User-Friendly Interface",
    "Real-Time Trading",
    "No Risk, Only Growth"
  ];

  return (
    <main className="px-8 md:pt-10 py-6 overflow-hidden flex w-screen pt-28">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-8">

          <h1 className="capitalize text-5xl md:text-6xl font-bold leading-tight text-center md:text-left">
            Control your <span className="text-primary">finances</span> like never before
          </h1>

          <p className="text-lg text-muted-foreground max-w-[600px] text-justify">
            With Athlas, you can easily create a user account, make instant transactions, and explore the world of trading—all without real money. Athlas empowers you to learn by doing, in a safe and risk-free environment.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="group bg-primary hover:bg-primary/80 shadow-lg shadow-green-900/25"
                  >
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="group bg-primary hover:bg-primary/80  shadow-lg shadow-green-900/25"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>

            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 relative z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-3xl -rotate-6 scale-95 w-full max-w-1/2 blur-2xl" />
            <Image
              src={heroImage}
              alt="Financial dashboard"
              placeholder="blur"
              width={600}
              height={400}
              className="rounded-3xl shadow-2xl"
            />
        </div>
      </div >
    </main >
  );
};

export default Hero;