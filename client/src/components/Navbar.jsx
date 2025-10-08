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
import StaggeredMenu from "./staggeredNav";

const SleekNavbar = () => {
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

  // Menu items for StaggeredMenu with login integrated
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Warehouse', ariaLabel: 'Access warehouse management', link: '/warehouse' },
    { label: 'Route Optimization', ariaLabel: 'Optimize your routes', link: '/optimize-routes' },
    ...(isAuthenticated && user ? [
      { label: 'Dashboard', ariaLabel: 'View dashboard', link: '/dashboard' },
      { label: 'Profile', ariaLabel: 'Edit profile', link: '/profile' },
      { 
        label: 'Logout', 
        ariaLabel: 'Logout from your account', 
        onClick: logoutHandler
      }
    ] : [
      { 
        label: 'Login', 
        ariaLabel: 'Login to your account', 
        link: '/register'
      }
    ])
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/100 border-gray-200 p-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link to="/">
                <img
                  src="/shape.png"
                  alt="ChainSaw Logo"
                  className="h-10 w-10 mr-2"
                />
              </Link>
              <p className="text-2xl poppins font-semibold">ChainSaw</p>
            </div>

            {/* Navigation Links - Center (Desktop Only) */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-8">
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
                <Link to="/supplier-selection">
                  <button className="text-gray-700 hover:text-[#4c9197] px-3 py-2 text-lg font-medium transition-colors duration-200 cursor-pointer">
                    Supplier Selection
                  </button>
                </Link>
                <Link to="/documentation">
                  <button className="text-gray-700 hover:text-[#4c9197] px-3 py-2 text-lg font-medium transition-colors duration-200 cursor-pointer">
                    Documentation
                  </button>
                </Link>
              </div>
            </div>

            {/* User Actions - Right (Desktop Only) */}
            <div className="hidden lg:flex items-center space-x-4">
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
                    className="cursor-pointer bg-[#143234] text-white rounded-4xl h-10 w-20 hover:bg-green-600"
                    onClick={() => navigate("/register")}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* StaggeredMenu - Fixed overlay for mobile/tablet only */}
      <div className="lg:hidden fixed inset-0 z-50" style={{ pointerEvents: 'none' }}>
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#000000"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={['#4c9197', '#143234']}
          logoUrl="/shape.png"
          accentColor="#4c9197"
          onMenuOpen={() => console.log('Menu opened')}
          onMenuClose={() => console.log('Menu closed')}
        />
      </div>
    </>
  );
};

export default SleekNavbar;



