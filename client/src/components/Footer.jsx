import React from "react";
import { Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Integrations", href: "#" },
        { name: "API Docs", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#143234] text-gray-800 poppins">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2">
              <img src="/box.png" alt="ChainSaw Logo" className="h-10 w-10" />
              <h3 className="text-2xl font-bold text-white poppins">ChainSaw</h3>
            </div>
            <p className="mt-4 text-white">
              The recipe for optimization perfection.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-lg font-semibold text-white font-bold">{column.title}</h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white hover:text-gray-400 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#143234] text-white">
        <div className="container mx-auto py-6 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t-2">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} ChainSaw. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white hover:scale-110 transform transition-transform duration-200"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-white hover:scale-110 transform transition-transform duration-200"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-white hover:scale-110 transform transition-transform duration-200"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
