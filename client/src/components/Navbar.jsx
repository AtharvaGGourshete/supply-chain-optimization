import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Menu, X } from "lucide-react"; // Import icons for the hamburger menu

const SleekNavbar = () => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      navigate("/register");
    }
  }, [isSuccess]);
  
  useEffect(() => {
    // Close mobile menu on resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { href: "/warehouse", label: "Warehouse" },
    { href: "/optimize-routes", label: "Route Optimization" },
    { href: "/supplier-selection", label: "Supplier Selection" },
    { href: "/documentation", label: "Documentation" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200 p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/shape.png" alt="ChainSaw Logo" className="h-10 w-10" />
              <p className="text-2xl poppins font-semibold text-gray-800">ChainSaw</p>
            </Link>
          </div>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <span className="text-gray-700 hover:text-[#4c9197] px-3 py-2 text-lg font-medium transition-colors duration-200 cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop User Actions & Mobile Menu Button */}
          <div className="flex items-center">
            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer h-10 w-10">
                      <AvatarImage src={user?.photoUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user?.name} />
                      <AvatarFallback>{(user?.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild><Link to="/dashboard">Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="cursor-pointer bg-[#143234] text-white rounded-lg h-10 px-6 hover:bg-green-700" onClick={() => navigate("/register")}>
                  Login
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-700 hover:text-[#4c9197] focus:outline-none">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                <span className="block text-gray-700 hover:text-[#4c9197] hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="border-t border-gray-200 my-2"></div>
            {isAuthenticated && user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="block text-gray-700 hover:text-[#4c9197] hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Dashboard</span>
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="block text-gray-700 hover:text-[#4c9197] hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium">Profile</span>
                </Link>
                <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="w-full text-left text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-md text-base font-medium">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="block text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SleekNavbar;
