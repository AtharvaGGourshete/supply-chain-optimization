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

const SleekNavbar = () => {
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

  return (
    
    <>
    
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/100 border-gray-200 p-2">
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
              <p className="text-2xl poppins font-semibold">ChainSaw</p>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/warehouse">
                  <button className="text-gray-700 hover:text-[#4c9197] px-3 py-2 text-lg font-medium transition-colors duration-200 cursor-pointer">
                    Warehouse
                  </button>
                </Link>

                <Link to="/optimize-routes">
                  <button className="text-gray-700 hover:text-[#4c9197] px-3 py-2 text-lg font-medium transition-colors duration-200 cursor-pointer">
                    Route Optimization
                  </button>
                </Link>
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
                    className="cursor-pointer bg-[#143234] text-white rounded-4xl h-10 w-20 border-yellow-400 hover:bg-green-600"
                    onClick={() => navigate("/register")}
                  >
                    Login
                  </Button>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-yellow-50/95 border-t border-gray-200">
              <Link to="/warehouse">
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-100 rounded-md transition-colors duration-200">
                  Warehouse
                </a>
              </Link>
              <Link to="/optimize-routes">
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-100 rounded-md transition-colors duration-200">
                  Route Optimization
                </a>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default SleekNavbar;
