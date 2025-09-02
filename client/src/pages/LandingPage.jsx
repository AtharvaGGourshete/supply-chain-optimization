"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Glow from "@/components/ui/glow";
import LogoLoop from "@/components/LogoLoop";
import { Link } from "react-router-dom";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
import { StickyScroll } from "@/components/scroll-reveal";
import { AppleCardsCarouselDemo } from "@/components/appledemo";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { useState, useEffect } from "react";

const LandingPage = () => {
  // Data for the "How It Works" process cards
  const processSteps = [
    {
      step: "01",
      title: "Step 1",
      description:
        "Initiate your supply chain setup by defining key parameters and requirements.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#1a1a1a,#2a2a2a)] text-white text-2xl font-bold">
          Step 1
        </div>
      ),
    },
    {
      step: "02",
      title: "Step 2",
      description:
        "Configure and optimize logistics workflows with real-time adjustments.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#2a2a2a,#3a3a3a)] text-white text-2xl font-bold">
          Step 2
        </div>
      ),
    },
    {
      step: "03",
      title: "Step 3",
      description:
        "Launch and monitor your chain for seamless operation and scalability.",
      content: (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,#3a3a3a,#4a4a4a)] text-white text-2xl font-bold">
          Step 3
        </div>
      ),
    },
  ];

  // Data for the new features section
  const features = [
    {
      title: "Inventory Optimization",
      description:
        "Minimize overstocking and stockouts by using ML models to calculate ideal reorder points and safety stock levels.",
      image: "/inventory.jpeg", // Replace with your actual image path
    },
    {
      title: "Supplier Selection & Scoring",
      description:
        "Use weighted scoring or ML models (e.g., Random Forest) to rank suppliers based on cost, reliability, lead time, and quality.",
      image: "/supplier.jpeg", // Replace with your actual image path
    },
    {
      title: "Route Optimization",
      description:
        "Apply algorithms (like Dijkstra or Google-OR) or AI (Reinforcement Learning) to reduce delivery times and fuel costs.",
      image: "/route.jpeg", // Replace with your actual image path
    },
  ];

  const defaultItems = [
    {
      label: "Users",
      value: "2.4K",
      description: "Active monthly users",
    },
    {
      label: "Revenue",
      value: "$125K",
      description: "Monthly recurring revenue",
    },
    {
      label: "Optimization",
      value: "48",
      description: "Completed this quarter",
    },
    {
      label: "Growth",
      value: "23",
      suffix: "%",
      description: "Year over year increase",
    },
  ];
  const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    {
      node: <SiTypescript />,
      title: "TypeScript",
      href: "https://www.typescriptlang.org",
    },
    {
      node: <SiTailwindcss />,
      title: "Tailwind CSS",
      href: "https://tailwindcss.com",
    },
  ];
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const statsItems = defaultItems;

  return (
    <>
      <Navbar />
      <main className="bg-[#101010] text-[#DDDBCB] font-poppins">
        <section className="relative min-h-screen flex items-center justify-center py-20 bg-[#101010] overflow-hidden">

          <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
            <Glow variant="top" intensity="high"/>
          </div>
          <div className="relative z-20 container mx-auto px-4 mt-28 w-full">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">

              <h1 className="text-6xl md:text-8xl font-bold leading-tight text-white tracking-tight relative inline-block">
                CHAINSAW
                <div className="mx-auto h-0.5 bg-gradient-to-r from-transparent via-[#DDDBCB]/30 to-transparent group-hover:via-[#DDDBCB]/60 transition-all duration-500" />
              </h1>

              <p className="text-lg text-[#DDDBCB]/70 max-w-2xl">
                The recipe for optimization perfection - Loved by logistics
                nerds everywhere
              </p>

              <div className="flex gap-4 items-center mt-2 justify-center">
                <Link to="/warehouse">
                  <Button
                    variant="default"
                    className="bg-white text-black hover:bg-[#101010] hover:text-white cursor-pointer"
                  >
                    Generate Warehouse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/optimize-routes">
                  <Button
                    variant="default"
                    className="bg-white text-black hover:bg-[#101010] hover:text-white cursor-pointer"
                  >
                    Optimize Routes <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>


            <div className="flex items-center justify-center p-8 mt-20">
              <div
                style={{
                  height: "200px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <LogoLoop
                  logos={[
                    {
                      node: <SiReact />,
                      title: "React",
                      href: "https://react.dev",
                    },
                    {
                      node: <SiNextdotjs />,
                      title: "Next.js",
                      href: "https://nextjs.org",
                    },
                    {
                      node: <SiTypescript />,
                      title: "TypeScript",
                      href: "https://www.typescriptlang.org",
                    },
                    {
                      node: <SiTailwindcss />,
                      title: "Tailwind CSS",
                      href: "https://tailwindcss.com",
                    },
                  ]}
                  speed={120}
                  direction="left"
                  logoHeight={78}
                  gap={50}
                  pauseOnHover
                  scaleOnHover
                  fadeOut
                  fadeOutColor="#101010"
                  ariaLabel="Technology partners"
                />
              </div>
            </div>
          </div>
        </section>


        <section className="py-24 bg-[#101010] relative overflow-hidden">

          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-white to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto text-center flex flex-col items-center gap-y-8 px-4 relative z-10">
            {/* Enhanced Header */}
            <div
              className={`transition-all duration-1000 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="inline-block p-3 bg-[#181818] rounded-2xl border border-[#DDDBCB]/20 mb-6">
                <span className="text-[#DDDBCB]/60 text-sm font-medium tracking-wider uppercase">
                  Simple Process
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight text-center">
                <span className="bg-gradient-to-r from-white via-[#DDDBCB] to-white bg-clip-text text-transparent">
                  Tap. Tap. Create!!
                </span>
              </h2>

              <div className="mx-auto h-0.5 bg-gradient-to-r from-transparent via-[#DDDBCB]/30 to-transparent group-hover:via-[#DDDBCB]/60 transition-all duration-500 mb-10" />

              <p className="text-xl text-[#DDDBCB]/80 md:w-2/3 mx-auto leading-relaxed text-center">
                Get your chains together in 3 simple steps with our streamlined
                workflow
              </p>
            </div>
          </div>

          {/* Enhanced Cards Grid */}
          <div className="container mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 rounded-xl gap-8 px-4 relative z-10">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 transform ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{ transitionDelay: step.delay }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`
              bg-[#181818] border border-[#DDDBCB]/20 text-left p-8 
              flex flex-col h-full relative overflow-hidden
              transition-all duration-500 ease-out cursor-pointer group
              ${
                hoveredCard === index
                  ? "border-white/60 scale-105 shadow-2xl shadow-white/10"
                  : "hover:border-white/40 hover:scale-[1.02]"
              }
            `}
                >
                  {/* Hover Glow Effect */}

                  {/* Step Number with Enhanced Styling */}
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <p
                        className={`
                    text-7xl font-bold transition-all duration-500
                    ${
                      hoveredCard === index
                        ? "text-white/20 scale-110"
                        : "text-white/10"
                    }
                  `}
                      >
                        {step.step}
                      </p>
                      <span
                        className={`
                    text-3xl transition-all duration-500 transform
                    ${
                      hoveredCard === index
                        ? "scale-125 rotate-12"
                        : "scale-100 rotate-0"
                    }
                  `}
                      >
                        {step.icon}
                      </span>
                    </div>

                    <h3
                      className={`
                  text-2xl font-semibold text-white transition-all duration-300
                  ${hoveredCard === index ? "text-[#DDDBCB]" : ""}
                `}
                    >
                      {step.title}
                    </h3>
                  </div>

                  {/* Enhanced Description */}
                  <div className="relative z-10 flex-grow">
                    <p className="text-[#DDDBCB]/80 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-[#DDDBCB]/10">
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                    w-3 h-3 rounded-full transition-all duration-500
                    ${
                      hoveredCard === index
                        ? "bg-[#DDDBCB] shadow-lg shadow-[#DDDBCB]/50"
                        : "bg-[#DDDBCB]/30"
                    }
                  `}
                      ></div>
                      <div
                        className={`
                    h-0.5 flex-grow transition-all duration-500
                    ${
                      hoveredCard === index
                        ? "bg-gradient-to-r from-[#DDDBCB] to-transparent"
                        : "bg-[#DDDBCB]/20"
                    }
                  `}
                      ></div>
                      <span
                        className={`
                    text-sm font-medium transition-all duration-300
                    ${
                      hoveredCard === index
                        ? "text-[#DDDBCB]"
                        : "text-[#DDDBCB]/60"
                    }
                  `}
                      >
                        Step {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Corner Accent */}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Connection Lines */}
          <div className="container mx-auto mt-8 px-4 relative z-10">
            <div className="hidden md:flex justify-center items-center gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`
                w-16 h-0.5 bg-gradient-to-r from-[#DDDBCB]/30 to-[#DDDBCB]/10
                transition-all duration-1000
                ${isVisible ? "scale-x-100" : "scale-x-0"}
              `}
                    style={{ transitionDelay: `${800 + i * 200}ms` }}
                  ></div>
                  <div
                    className={`
                w-2 h-2 bg-[#DDDBCB]/40 rounded-full mx-2
                transition-all duration-500
                ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
              `}
                    style={{ transitionDelay: `${1000 + i * 200}ms` }}
                  ></div>
                  <div
                    className={`
                w-16 h-0.5 bg-gradient-to-r from-[#DDDBCB]/10 to-[#DDDBCB]/30
                transition-all duration-1000
                ${isVisible ? "scale-x-100" : "scale-x-0"}
              `}
                    style={{ transitionDelay: `${800 + i * 200}ms` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div
            className={`
        container mx-auto mt-16 text-center px-4 relative z-10
        transition-all duration-1000 transform
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
            style={{ transitionDelay: "1200ms" }}
          >
            {/* <button
              className="
          px-8 py-4 bg-gradient-to-r from-[#DDDBCB]/10 to-[#DDDBCB]/5
          border border-[#DDDBCB]/30 rounded-xl text-white font-semibold
          transition-all duration-300 hover:from-[#DDDBCB]/20 hover:to-[#DDDBCB]/10
          hover:border-[#DDDBCB]/60 hover:shadow-lg hover:shadow-[#DDDBCB]/20
          transform hover:scale-105 active:scale-95
        "
            >
              Start Building Now →
            </button> */}
          </div>
        </section>

        {/* Features Section replaced with AppleCardsCarouselDemo */}
        <section className=" bg-[#101010]">
          <div className="container mx-auto px-4">
            <AppleCardsCarouselDemo />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
