import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset, // <-- Import SidebarInset
} from "@/components/ui/sidebar";
import {
  Home,
  Settings,
  User,
  BarChart2,
  Database,
  HelpCircle,
  LogOut,
  DollarSign,
  CheckCircle,
  Clock,
  ClipboardList,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import React from "react";

// Reusable Stat Card component
const StatCard = ({ icon, title, value, details }) => (
  <div className="bg-[#181818] p-4 rounded-lg flex flex-col justify-between border border-[#232323] shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400">{title}</p>
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-xs text-green-400">{details}</p>
    </div>
  </div>
);

const Dashboard = () => (
  <SidebarProvider> {/* 1. Provider wraps the entire layout */}
    <div className="flex min-h-screen font-poppins bg-[#101010] text-white">
      {/* Sidebar */}
      <Sidebar className="w-64 bg-[#101010] border-r border-[#202020]">
        <SidebarHeader className="p-4 border-b border-[#202020]">
          <h2 className="text-xl font-semibold text-white">ChainSaw</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Home size={18} className="mr-3" />
                  Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BarChart2 size={18} className="mr-3" />
                  Analytics
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Database size={18} className="mr-3" />
                  Databases
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="py-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <HelpCircle size={18} className="mr-3" />
                  Help
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings size={18} className="mr-3" />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <User size={18} className="mr-3" />
                  Profile
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-[#202020]">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LogOut size={18} className="mr-3" />
                Log Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* 2. Main content is now wrapped in SidebarInset */}
      <SidebarInset>
        <main className="flex-1 p-8 bg-[#101010]"> {/* 3. Removed manual margins */}
          <header className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-400">Pages / Dashboard</p>
              <h1 className="text-3xl font-bold text-white">Main Dashboard</h1>
            </div>
            {/* You can add a trigger button here if you want */}
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatCard icon={<DollarSign size={20} className="text-gray-400" />} title="Revenue this month" value="$3,050.47" details="+2.5%" />
            <StatCard icon={<TrendingUp size={20} className="text-gray-400" />} title="Spend this month" value="$742.39" details="+5%" />
            <StatCard icon={<ClipboardList size={20} className="text-gray-400" />} title="Reports Submitted" value="27" details="This month" />
            <StatCard icon={<Briefcase size={20} className="text-gray-400" />} title="New Tasks" value="154" details="+20 since last week" />
            <StatCard icon={<CheckCircle size={20} className="text-gray-400" />} title="Completed Tasks" value="2935" details="All time" />
            <StatCard icon={<Clock size={20} className="text-gray-400" />} title="Ongoing Projects" value="32" details="Active" />
            
            <div className="sm:col-span-2 lg:col-span-2 xl:col-span-3 p-4 bg-[#181818] rounded-lg border border-[#232323] h-64 text-white">Main Chart</div>
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-3 p-4 bg-[#181818] rounded-lg border border-[#232323] h-64 text-white">Project Completion</div>
            <div className="sm:col-span-1 lg:col-span-1 xl:col-span-2 p-4 bg-[#181818] rounded-lg border border-[#232323] h-64 text-white">Team Members</div>
            <div className="sm:col-span-1 lg:col-span-2 xl:col-span-2 p-4 bg-[#181818] rounded-lg border border-[#232323] h-64 text-white">Tasks</div>
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 p-4 bg-[#181818] rounded-lg border border-[#232323] h-96 text-white">Weekly Reports</div>
          </div>
        </main>
      </SidebarInset>
    </div>
  </SidebarProvider>
);

export default Dashboard;
