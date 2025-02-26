import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Truck,
  Users,
  HardHat,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/machines", icon: Truck, label: "Machines" },
    { href: "/brigades", icon: Users, label: "Brigades" },
    { href: "/workers", icon: HardHat, label: "Workers" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-sidebar transition-all duration-300 border-r border-sidebar-border flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <span className="text-xl font-bold text-sidebar-foreground">
            ConstructionMgr
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <Separator className="bg-sidebar-border" />
      <nav className="flex-1 p-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <a
              className={`flex items-center px-3 py-2 mb-1 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${
                location === link.href ? "bg-sidebar-accent" : ""
              }`}
            >
              <link.icon className="h-5 w-5" />
              {!collapsed && <span className="ml-3">{link.label}</span>}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}