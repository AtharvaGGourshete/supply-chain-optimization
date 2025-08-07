import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  // Data for the "How It Works" process cards
  const processSteps = [
    {
      step: "01",
      title: "Get Registered",
      description:
        "Sign up for a free account in seconds. No credit card required, just your passion for efficiency.",
    },
    {
      step: "02",
      title: "Create Warehouse & Upload Data",
      description:
        "Easily define your warehouse layout and then upload your inventory or order data with a simple CSV file.",
    },
    {
      step: "03",
      title: "You're All Set to Optimize",
      description:
        "Our engine gets to work, providing actionable insights to streamline your entire logistics operation.",
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

  return (
    <>
      <Navbar />
      <main className="bg-[#101010] text-[#DDDBCB] font-poppins">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-start py-20">
          <div className="absolute inset-0 w-full h-full z-10 overflow-hidden">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/logistics.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute inset-0 w-full h-full z-20 bg-gradient-to-r from-[#101010] via-[#101010]/90 to-transparent"></div>
          <div className="relative z-30 container mx-auto px-4">
            <div className="flex flex-col gap-y-6 md:w-1/2">
              <Badge
                variant="outline"
                className="w-fit border-[#DDDBCB]/50 text-[#DDDBCB]"
              >
                ChainSaw
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                The recipe for optimization perfection
              </h1>
              <p className="text-lg text-[#DDDBCB]/80">
                Loved by logistics nerds everywhere
              </p>
              <div className="flex gap-4 items-center mt-2">
                <Link to='/warehouse'>
                  <Button
                    variant="default"
                    className="bg-white text-black hover:bg-[#101010] hover:text-white cursor-pointer"
                  >
                    Generate Warehouse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-[#101010]">
          <div className="container mx-auto text-center flex flex-col items-center gap-y-8 px-4">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white">
              Tap. Tap. Create!!
            </h2>
            <p className="text-xl text-[#DDDBCB]/80 md:w-2/3">
              Get your chains together in 3 simple steps
            </p>
          </div>

          <div className="container mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {processSteps.map((step, index) => (
              <Card
                key={index}
                className="bg-[#181818] border-[#DDDBCB]/20 text-left p-6 flex flex-col transition-all duration-300 hover:border-white/50 hover:scale-105 cursor-pointer"
              >
                <CardHeader>
                  <p className="text-6xl font-bold text-white/10">
                    {step.step}
                  </p>
                  <h3 className="text-2xl font-semibold text-white mt-2">
                    {step.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-[#DDDBCB]/80">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-[#101010]">
          <div className="container mx-auto px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 not-first:mt-16"
              >
                {/* Text Column */}
                <div
                  className={`flex flex-col gap-y-4 ${
                    index % 2 !== 0 ? "md:order-last" : ""
                  }`}
                >
                  <h3 className="text-3xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-[#DDDBCB]/80">
                    {feature.description}
                  </p>
                  <Button variant="link" className="p-0 text-white w-fit">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {/* Image Column */}
                <div>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="rounded-lg shadow-2xl shadow-white/10 w-full h-auto object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;
