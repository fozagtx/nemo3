import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { LogOut, Mic, FileAudio, Settings, LayoutDashboard } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Audio Files",
    url: "/audio-files",
    icon: FileAudio,
  },
  {
    title: "Conversions",
    url: "/conversions",
    icon: Mic,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ onSignOut }: { onSignOut?: () => void }) {
  return (
    <ShadSidebar className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800 text-white min-h-screen">
      <SidebarHeader className="flex items-center space-x-3 p-6">
        <img src="/nemo-g.png" alt="nimo3 Logo" className="w-10 h-10 rounded-lg" />
        <span className="font-semibold text-lg">nimo3</span>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400 text-xs font-medium uppercase tracking-wider px-4 mt-2 mb-1">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-zinc-800 mt-auto">
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 px-4 py-2 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </SidebarFooter>
    </ShadSidebar>
  );
} 