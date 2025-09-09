import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { LineShadowText } from "./magicui/line-shadow-text";
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

const SleekNavbar = () => {
  //const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/register");
    }
  }, [isSuccess]);

  // Dark mode toggle
  // useEffect(() => {
  //   if (isDark) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [isDark]);

  // const toggleDarkMode = () => {
  //   setIsDark(!isDark);
  // };

  // const toggleMobileMenu = () => {
  //   setIsMobileMenuOpen(!isMobileMenuOpen);
  // };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-[#DDDBCB]/10 p-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <img
                  src="/box.png"
                  alt="ChainSaw Logo"
                  className="h-10 w-10 mr-2"
                />
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/warehouse">
                  <button className="text-[#DDDBCB] dark:text-gray-300 hover:text-[#CEAF53] dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer">
                    Warehouse
                  </button>
                </Link>

                <Link to="/optimize-routes">
                  <button className="text-[#DDDBCB] dark:text-gray-300 hover:text-[#CEAF53] dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer">
                    Route Optimization
                  </button>
                </Link>

                <a
                  href="#"
                  className="text-[#DDDBCB] dark:text-gray-300 hover:text-[#CEAF53] dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="text-[#DDDBCB] dark:text-gray-300 hover:text-[#CEAF53] dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Pricing
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                        alt={user?.name || "user"}
                      />
                      <AvatarFallback>
                        {(user?.name || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Edit Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logoutHandler}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {user?.role === "instructor" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => navigate("/register")}
                  >
                    Login
                  </Button>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Products
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Solutions
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Documentation
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              >
                Pricing
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default SleekNavbar;
