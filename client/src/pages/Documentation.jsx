import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import SleekNavbar from "@/components/Navbar";

const Documentation = () => {
  const parameters = [
    {
      id: "serviceLevel",
      title: "Service Level",
      description:
        "The probability that demand will not exceed supply during the lead time. A higher service level means fewer stockouts, but it usually increases inventory costs.",
    },
    {
      id: "leadTime",
      title: "Lead Time",
      description:
        "The time between placing an order and receiving it. Lead time impacts how much safety stock is needed to cover unexpected delays or demand spikes.",
    },
    {
      id: "currentInventory",
      title: "Current On-Hand Inventory",
      description:
        "The amount of stock currently available in storage. This helps determine when to reorder and avoid stockouts.",
    },
    {
      id: "orderingCost",
      title: "Ordering Cost",
      description:
        "The fixed cost incurred every time an order is placed, regardless of the order size. This can include administrative, shipping, and handling costs.",
    },
    {
      id: "holdingCost",
      title: "Holding Cost",
      description:
        "The cost of keeping one unit in inventory for a specific period, usually per year. It includes storage, insurance, depreciation, and opportunity costs.",
    },
    {
      id: "unitCost",
      title: "Unit Cost",
      description:
        "The purchase price for a single unit of the product. This forms the basis for calculating total purchase and holding costs.",
    },
  ];

  const location = useLocation();
  const paramRefs = useRef({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightId = params.get("highlight");

    if (highlightId && paramRefs.current[highlightId]) {
      const element = paramRefs.current[highlightId];

      // Wait for a moment to ensure the page has rendered, then scroll
      setTimeout(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Add highlight class for the animation
        element.classList.add("highlight-animation");

        // Remove the class after the animation completes
        setTimeout(() => {
          element.classList.remove("highlight-animation");
        }, 1500); // Duration should match the animation
      }, 100);
    }
  }, [location]);

  return (
    <>
      <SleekNavbar />
      <div className="min-h-screen mt-20 bg-gray-50 py-14 px-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 border-b border-gray-200 pb-5">
            <h1 className="text-4xl font-semibold text-[#143234] leading-tight">
              Inventory Parameters Documentation
            </h1>
            <p className="mt-3 text-gray-600 text-lg max-w-xl">
              Comprehensive explanations of key inventory management terms used
              across the platform, designed for clarity and ease of
              understanding.
            </p>
          </header>
          <section className="space-y-10">
            {parameters.map((param) => (
              <article
                key={param.id}
                ref={(el) => (paramRefs.current[param.id] = el)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 p-7"
              >
                <h2 className="text-2xl font-medium text-[#143234] mb-3">
                  {param.title}
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">
                  {param.description}
                </p>
              </article>
            ))}
          </section>
        </div>
      </div>
      <Footer />
      {/* CSS for the highlight animation */}
      <style>{`
        .highlight-animation {
          animation: highlight-flash 1.5s ease-out;
        }

        @keyframes highlight-flash {
          0% {
            background-color: white;
            transform: scale(1);
          }
          30% {
            background-color: #fefcbf; /* Light yellow highlight */
            transform: scale(1.02);
            box-shadow: 0 0 25px rgba(254, 252, 191, 0.8);
          }
          100% {
            background-color: white;
            transform: scale(1);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </>
  );
};

export default Documentation;
