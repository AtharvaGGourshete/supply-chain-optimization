"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import LogoLoop from "@/components/LogoLoop";
import { AppleCardsCarouselDemo } from "@/components/appledemo";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { useState, useEffect } from "react";
import { Ripple } from "@/components/magicui/ripple";

const LandingPage = () => {
  // Data for the "How It Works" process cards
  const processSteps = [
    {
      step: "01",
      title: "Step 1: Define",
      description:
        "Initiate your supply chain setup by defining key parameters and requirements.",
      delay: "300ms",
    },
    {
      step: "02",
      title: "Step 2: Configure",
      description:
        "Configure and optimize logistics workflows with real-time adjustments.",
      delay: "500ms",
    },
    {
      step: "03",
      title: "Step 3: Launch",
      description:
        "Launch and monitor your chain for seamless operation and scalability.",
      delay: "700ms",
    },
  ];

  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 text-gray-800 font-poppins">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center py-20 bg-white/100 overflow-hidden">
          {/* Ripple Background */}
          <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden w-full h-full mt-20">
            {/* The Ripple will be contained here, in the background */}
            <Ripple/>
          </div>

          {/* Main content */}
          <div className="relative z-20 container mx-auto px-4 w-full">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
              {/* The original div wrapping Ripple has been removed from here */}
              <span className="text-6xl text-black poppins font-medium">
                Cut Through Complexity.
                <div className="h-3"></div>
                Optimize Your{" "}
                <span className="text-[#346754]">Supply Chain</span>
              </span>
              <p className="text-lg text-gray-500 poppins max-w-2xl">
                The recipe for optimization perfection - Loved by logistics
                nerds everywhere
              </p>
              <div className="flex gap-4 items-center mt-2 justify-center">
                <Link to="/warehouse">
                  <Button
                    variant="default"
                    className="bg-[#143234] text-white hover:bg-[#24595c] cursor-pointer rounded-4xl h-16 w-48"
                  >
                    Generate Warehouse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/optimize-routes">
                  <Button
                    variant="default"
                    className="bg-[#143234] text-white hover:bg-[#24595c] cursor-pointer rounded-4xl h-16 w-48"
                  >
                    Optimize Routes <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-[#143234] relative overflow-hidden">
          <div className="container mx-auto text-center flex flex-col items-center gap-y-8 px-4 relative z-10">
            <div
              className={`transition-all duration-1000 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="inline-block p-3 bg-[#284c4f] rounded-2xl mb-6">
                <span className="text-white text-sm font-medium tracking-wider uppercase">
                  Simple Process
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 leading-tight text-center">
                <span className="text-white">
                  Tap. Tap. <span className="text-[#4c9197]">Create!!</span>
                </span>
              </h2>

              <div className="mx-auto h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:via-gray-400 transition-all duration-500 mb-10" />

              <p className="text-xl text-white md:w-2/3 mx-auto leading-relaxed text-center">
                Get your chains together in 3 simple steps with our streamlined
                workflow
              </p>
            </div>
          </div>

          <div className="container mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 relative z-10">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 transform  ${
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
                    bg-[#1f3c3f] text-left p-8 rounded-2xl
                    flex flex-col h-full relative overflow-hidden
                    transition-all duration-500 ease-out cursor-pointer group
                    ${
                      hoveredCard === index
                        ? "border-[#143234] scale-105 shadow-2xl shadow-[#23565a]"
                        : "hover:border-gray-300 hover:scale-[1.02] hover:shadow-lg"
                    }
                  `}
                >
                  <div className="relative z-10 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <p
                        className={`
                          text-7xl font-bold transition-all duration-500
                          ${
                            hoveredCard === index
                              ? "text-gray-200 scale-110"
                              : "text-gray-100"
                          }
                        `}
                      >
                        {step.step}
                      </p>
                    </div>
                    <h3
                      className={`
                        text-2xl text-white font-semibol transition-all duration-300
                      `}
                    >
                      {step.title}
                    </h3>
                  </div>

                  <div className="relative z-10 flex-grow">
                    <p className="leading-relaxed text-lg text-white">
                      {step.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div
                        className={`
                          w-3 h-3 rounded-full transition-all duration-500
                          ${
                            hoveredCard === index
                              ? "bg-[#143234] shadow-lg shadow-[#143234]"
                              : "bg-gray-300"
                          }
                        `}
                      ></div>
                      <div
                        className={`
                          h-0.5 flex-grow transition-all duration-500
                          ${
                            hoveredCard === index
                              ? "bg-[#143234] shadow-lg shadow-[#143234]"
                              : "bg-white"
                          }
                        `}
                      ></div>
                      <span
                        className={`
                          text-sm font-medium transition-all duration-300
                          ${
                            hoveredCard === index
                              ? "text-white"
                              : "text-gray-500"
                          }
                        `}
                      >
                        Step {step.step.substring(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-24">
          <div className="container bg-white/100 mx-auto px-4">
            <AppleCardsCarouselDemo />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
