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
    <footer className="bg-[#101010] text-[#DDDBCB] font-poppins border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex">
              
              <h3 className="text-xl font-bold text-white">ChainSaw</h3>
            </div>

            <p className="mt-2 text-[#DDDBCB]/80">
              The recipe for optimization perfection.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-white">{column.title}</h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-[#DDDBCB]/80 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#DDDBCB]/60">
            &copy; {new Date().getFullYear()} ChainSaw. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-[#DDDBCB]/60 hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-[#DDDBCB]/60 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-[#DDDBCB]/60 hover:text-white transition-colors"
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
