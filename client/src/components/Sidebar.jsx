import React, { useEffect } from 'react';
import {
  FiHome,
  FiBarChart2,
  FiCheckSquare,
  FiFlag,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from 'react-icons/fi';
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { Button } from './ui/button';

// The context for managing the expanded state
const SidebarContext = createContext();

// The main Sidebar component (replacing the static one)
export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
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
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        {/* Header/Logo Section */}
        <div className="p-4 pb-2 flex justify-between items-center">
          {/* Using a placeholder for the Dashboard text since the provided one uses an image */}
          <span
            className={`self-center text-xl font-semibold whitespace-nowrap overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Dashboard
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar Items Section */}
        <SidebarContext.Provider value={{ expanded }}>
          {/* Note: In your original code, the menu items were hardcoded inside the static Sidebar component.
              In this updated component, I am putting them here, but typically, the 'children' prop would be used to pass them in from a parent component. */}
          <ul className="flex-1 px-3">
            <SidebarItem icon={<FiHome size={20} />} text="Single Product Optimization" active />
            <SidebarItem icon={<FiBarChart2 size={20} />} text="Aggregate Business Forecast" alert />
            {/* Additional items from the static example, using the new SidebarItem */}
            <SidebarItem icon={<FiCheckSquare size={20} />} text="Tasks" />
            <SidebarItem icon={<FiFlag size={20} />} text="Reports" />
            <Link to="/profile  ">
            <SidebarItem icon={<FiUsers size={20} />} text="Profile" /></Link>
            <SidebarItem icon={<FiSettings size={20} />} text="Settings" />
            <SidebarItem icon={<FiHelpCircle size={20} />} text="Help" />
            {/* <Button onClick={logoutHandler} variant={"outline"}>
            <SidebarItem icon={<FiLogOut size={20} />} text="Logout" /></Button> */}
          </ul>
        </SidebarContext.Provider>

        {/* User Profile Section */}
        <div className="flex p-3">
         <SidebarContext.Provider value={{ expanded }}>
          <Button onClick={logoutHandler} variant={"outline"}>
            <SidebarItem icon={<FiLogOut size={20} />} text="Logout" /></Button>
          </SidebarContext.Provider>
        </div>
      </nav>
    </aside>
  );
}

// The reusable SidebarItem component
export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

// Removing the previous 'export default Sidebar;' since the new one is 'export default function Sidebar'
// and is exported above.