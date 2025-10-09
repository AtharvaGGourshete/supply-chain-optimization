// path: frontend/src/components/Sidebar.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setActiveAnalysis } from '../features/analysisSlice';
import { useLogoutUserMutation } from '../features/api/authApi';
import { LayoutDashboard, BarChart, Warehouse, Route, Users, LogOut, User } from 'lucide-react';
import { Separator } from "@/components/ui/separator"

const SidebarItem = ({ icon, text, to, onClick, isActive }) => {
    const activeClass = isActive ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-green-800 hover:text-white';
    
    const content = (
        <span className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${activeClass}`}>
            {icon}
            <span className="ml-3">{text}</span>
        </span>
    );
    
    if (to) {
        return <Link to={to}>{content}</Link>;
    }
    
    return <div onClick={onClick} className="cursor-pointer">{content}</div>;
};

export const Sidebar = () => {
    const { activeAnalysis, singleData, aggregateData } = useSelector((state) => state.analysis);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [logoutUser] = useLogoutUserMutation();

    const handleNavigation = (analysisType) => {
        dispatch(setActiveAnalysis(analysisType));
        navigate('/dashboard');
    };

    const handleLogout = async () => {
        await logoutUser();
        navigate('/'); // Redirect to landing page after logout
    };

    const handleProfileNavigation = () => {
        navigate('/profile');
    }

    const isDashboardActive = location.pathname === '/dashboard';

    return (
        <aside className="w-64 bg-[#143234] text-white p-4 flex flex-col justify-between">
            <div>
                {/* Logo or App Name */}
                <div className="flex items-center ml-3">
                            <Link to="/" className="flex items-center space-x-2">
                              <img src="/shape.png" alt="ChainSaw Logo" className="h-10 w-10" />
                              <p className="text-2xl poppins font-semibold text-white ">ChainSaw</p>
                            </Link>
                          </div>
                <nav className="space-y-2 mt-4">
                    {singleData && (
                        <SidebarItem 
                            icon={<LayoutDashboard size={20} />}
                            text="Single Product"
                            onClick={() => handleNavigation('single')}
                            isActive={isDashboardActive && activeAnalysis === 'single'}
                        />
                    )}
                    {aggregateData && (
                        <SidebarItem 
                            icon={<BarChart size={20} />}
                            text="Aggregate Business"
                            onClick={() => handleNavigation('aggregate')}
                            isActive={isDashboardActive && activeAnalysis === 'aggregate'}
                        />
                    )}
                    <SidebarItem 
                        icon={<Warehouse size={20} />}
                        text="Warehouse Setup"
                        to="/warehouse"
                        isActive={location.pathname === '/warehouse'}
                    />
                     <SidebarItem 
                        icon={<Route size={20} />}
                        text="Optimize Routes"
                        to="/optimize-routes"
                        isActive={location.pathname === '/optimize-routes'}
                    />
                     <SidebarItem 
                        icon={<Users size={20} />}
                        text="Supplier Selection"
                        to="/supplier-selection"
                        isActive={location.pathname === '/supplier-selection'}
                    />
                </nav>
            </div>

            
            {/* Logout Button at the bottom */}
            <div>
                 <Separator className="mb-2"/>
                 <SidebarItem 
                    icon={<User size={20} />}
                    text="Profile"
                    onClick={handleProfileNavigation}
                    className="hover:bg-green-600"
                />
                 <SidebarItem 
                    icon={<LogOut size={20} />}
                    text="Logout"
                    onClick={handleLogout}
                    className="hover:bg-green-600"
                />
            </div>
        </aside>
    );
};
