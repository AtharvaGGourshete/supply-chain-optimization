"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { MonitorCheck, Ticket } from "lucide-react";
import { SiMoneygram, SiScala } from "react-icons/si";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-24 bg-[#101010] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#DDDBCB] to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-[#DDDBCB] to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
        <div className="inline-block p-3 bg-[#181818] rounded-2xl border border-[#DDDBCB]/20 mb-6">
          <span className="text-[#DDDBCB]/60 text-sm font-medium tracking-wider uppercase">
            Supply Chain Solutions
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          <span className="bg-gradient-to-r from-white via-[#DDDBCB] to-white bg-clip-text text-transparent">
            Optimize Your Operations
          </span>
        </h2>

        <div className="mx-auto h-0.5 bg-gradient-to-r from-transparent via-[#DDDBCB]/30 to-transparent mb-8 w-96"></div>

        <p className="text-lg text-[#DDDBCB]/80 max-w-3xl mx-auto leading-relaxed">
          Discover how ChainSaw transforms complex supply chain challenges into streamlined solutions
        </p>
      </div>

      {/* Enhanced Carousel Container */}
       <div className="relative z-10 carousel-fade-container">
        <Carousel 
          items={cards} 
          className="w-full"
          containerClassName="max-w-7xl mx-auto"
          cardClassName="group transition-all duration-700 hover:scale-105 transform-gpu"
        />
      </div>
    </div>
  );
}



const DummyContent = () => {
  const contentData = [
    {
      title: "ChainSaw revolutionizes supply chain management with AI-powered insights.",
      description: "Track inventory levels, optimize routes in real-time, and predict demand patterns with unprecedented accuracy. Our machine learning algorithms continuously learn from your data to provide increasingly precise recommendations.",
      stats: [
        { value: "95%", label: "Accuracy", icon: <Ticket/> },
        { value: "40%", label: "Cost Reduction", icon: <SiMoneygram/> },
        { value: "24/7", label: "Monitoring", icon: <MonitorCheck/> },
        { value: "∞", label: "Scalability", icon: <SiScala/> }
      ]
    },

  ];

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full max-w-none px-3 sm:px-4 lg:px-6">
        <div className="space-y-3 sm:space-y-4">
          {contentData.map((content, index) => (
            <div
              key={`content-card-${index}`}
              className="bg-gradient-to-br from-[#181818] via-[#1a1a1a] to-[#1c1c1c] border border-[#DDDBCB]/20 p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl hover:border-[#DDDBCB]/60 transition-all duration-500 group overflow-hidden relative w-full"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DDDBCB]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <div className="relative z-10">
                {/* Main content */}
                <div className="mb-4 sm:mb-6">
                  <div className="text-[#DDDBCB]/80 text-xs sm:text-sm lg:text-base font-sans leading-relaxed group-hover:text-[#DDDBCB]/95 transition-colors duration-300">
                    <div className="font-bold text-[#DDDBCB] group-hover:text-white transition-colors duration-300 mb-2 text-sm sm:text-base lg:text-lg break-words">
                      {content.title}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base opacity-90 break-words">
                      {content.description}
                    </div>
                  </div>
                </div>

                {/* Stats section */}
                <div className="p-2 sm:p-3 lg:p-4 bg-[#0a0a0a] rounded-lg sm:rounded-xl border border-[#DDDBCB]/10 group-hover:border-[#DDDBCB]/30 transition-all duration-500 group-hover:bg-[#0d0d0d] w-full">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                    {content.stats.map((stat, statIndex) => (
                      <div 
                        key={`stat-${index}-${statIndex}`}
                        className="text-center group-hover:scale-105 transition-all duration-300 hover:scale-110 min-w-0 flex-shrink-0"
                        style={{ transitionDelay: `${statIndex * 100}ms` }}
                      >
                        <div className="flex flex-col items-center space-y-1">
                          <div className="text-sm sm:text-base lg:text-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                            {stat.icon}
                          </div>
                          <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-[#DDDBCB] group-hover:text-white transition-colors duration-300 truncate w-full max-w-full">
                            {stat.value}
                          </div>
                          <div className="text-xs sm:text-xs lg:text-sm text-[#DDDBCB]/60 group-hover:text-[#DDDBCB]/80 transition-colors duration-300 font-medium truncate w-full max-w-full leading-tight">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compact action button */}
                <div className="mt-4 sm:mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DummyContent;

const data = [
  {
    category: "AI-Powered Analytics",
    title: "Intelligent Demand Forecasting",
    src: "/logo1.png",
    content: <DummyContent />,
  },
  {
    category: "Logistics Optimization",
    title: "Smart Route Planning",
    src: "/logo2.png",
    content: <DummyContent />,
  },
  {
    category: "Supply Chain",
    title: "Real-time Inventory Management",
    src: "/logo3.png",
    content: <DummyContent />,
  },
  {
    category: "Warehouse",
    title: "Automated Warehouse Operations",
    src: "/logo4.png",
    content: <DummyContent />,
  },
  {
    category: "Performance",
    title: "Advanced Analytics Dashboard",
    src: "/logo5.png",
    content: <DummyContent />,
  },
  {
    category: "Integration",
    title: "Seamless Platform Integration",
    src: "/logo6.png",
    content: <DummyContent />,
  },
];