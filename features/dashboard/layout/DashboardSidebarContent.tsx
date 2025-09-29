"use client";

import { useSidebar } from "./SidebarProvider";
import { motion } from "framer-motion";
import DashboardActiveLink from "./DashboardActiveLink";
import { cn } from "@/lib/utils";

import {
  Users,
  BarChart3,
  CalendarDays,
  PhoneCall,
  Hash,
  AnchorIcon,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import CallModeSwitch from "@/components/CallRouteModeSwitch";

export type SidebarItemType = {
  name: string;
  href: string;
  icon: string;
  children?: SidebarItemType[];
};

type SidebarContentType = {
  mainItems: SidebarItemType[];
  subItems?: SidebarItemType[];
};

const icons = {
  barChart: BarChart3,
  users: Users,
  calender: CalendarDays,
  callManagement: PhoneCall,
  number: Hash,
};

export default function SidebarContent({
  mainItems,
  subItems,
}: SidebarContentType) {
  const { isCollapsedSidebar, isExpanded } = useSidebar();
  return (
    <div className="h-full flex flex-col justify-between gap-6 px-2 overflow-hidden">
      <ul className={cn("space-y-2 overflow-hidden")}>
        {mainItems.map((item) => {
          const Icon = icons[item.icon as keyof typeof icons];
          return (
            <li key={item.name}>
              <DashboardActiveLink
                className={cn("flex items-center whitespace-nowrap h-10")}
                href={item.href}
              >
                <span className="flex h-10 w-12 shrink-0 items-center justify-center">
                  <Icon className="size-4" />
                </span>
                <AnimatedLabel>{item.name}</AnimatedLabel>
              </DashboardActiveLink>
            </li>
          );
        })}
      </ul>
      <ul className={cn("space-y-2", isCollapsedSidebar && "space-y-4")}>
        {subItems &&
          subItems.map((item) => (
            <li key={item.name}>
              <DashboardActiveLink
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap bg-blue text-white rounded-md",
                  isExpanded && "py-2 px-6"
                )}
                href={item.href}
              >
                <AnimatedLabel>{item.name}</AnimatedLabel>
              </DashboardActiveLink>
            </li>
          ))}
        <li>
          <CallModeSwitch />
        </li>
        <li className="mb-4">
          <SidebarLogoutButton />
        </li>
      </ul>
    </div>
  );
}

const animatedLabelVariants = {
  collapsed: {
    opacity: 0,
  },
  expanded: {
    opacity: 1,
  },
};

function AnimatedLabel({ children }: React.PropsWithChildren) {
  const { isExpanded } = useSidebar();

  return (
    isExpanded && (
      <motion.span
        variants={animatedLabelVariants}
        initial="collapsed"
        animate="expanded"
      >
        {children}
      </motion.span>
    )
  );
}

function SidebarLogoutButton() {
  return (
    <LogoutButton>
      <AnchorIcon className="size-4" />
      <AnimatedLabel>Logout</AnimatedLabel>
    </LogoutButton>
  );
}
