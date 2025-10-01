"use client";

import { ChevronsRight } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import Image from "next/image";

export default function Sidebar({ children }: React.PropsWithChildren) {
  const { handlePointerEnter, handlePointerLeave, isCollapsedSidebar } =
    useSidebar();

  return (
    <motion.nav
      className={cn(
        "h-[calc(100vh-theme(space.8))] flex flex-col z-[60] sticky top-4 whitespace-nowrap border-r border-r-dark3 shadow-xs"
      )}
      style={{
        width: isCollapsedSidebar
          ? "var(--_sidebar-collapsed)"
          : "var(--_sidebar-expanded)",
      }}
      animate={{
        width: isCollapsedSidebar
          ? "var(--_sidebar-collapsed)"
          : "var(--_sidebar-expanded)",
      }}
      whileHover={{
        width: "var(--_sidebar-expanded)",
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute right-0 top-0 z-10">
        <SidebarToggleButton />
      </div>
      <SidebarHeader />

      <div className="flex-1 space-y-[var(--_sidebar-spacing)] bg-dark2 rounded-bl rounded-br">
        {children}
      </div>
    </motion.nav>
  );
}

function SidebarHeader() {
  return (
    <div className="p-[var(--_sidebar-spacing)] flex gap-2 items-center relative min-h-[var(--_sidebar-header-height)] max-h-[var(--_sidebar-header-height)] bg-dark2 shadow-xs rounded-tr rounded-tl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="shrink-0 flex w-full justify-center"
      >
        <Image
          src={
            "https://res.cloudinary.com/dazooknyy/image/upload/v1759279032/whats-real-easy-logo_hoddtr.jpg"
          }
          alt="Logo"
          width={140}
          height={40}
          className="w-10 h-10"
        />
      </motion.div>
    </div>
  );
}

// function SidebarFooter() {
//   const { isExpanded } = useSidebar();

//   return (
//     <div className="p-4 flex gap-2 items-start h-[var(--_sidebar-footer-height)]">
//       <span className="bg-accent text-primary rounded">
//         <SidebarIcon icon={LucideUser} size="lg" />
//       </span>

//       {isExpanded && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mt-2"
//         ></motion.div>
//       )}
//     </div>
//   );
// }

// function SidebarIcon({
//   icon,
//   size = "lg",
// }: {
//   icon: React.ComponentType<{ className: string }>;
//   size?: "sm" | "lg";
// }) {
//   return (
//     <span
//       className={
//         "size-[var(--_sidebar-icon-container)] leading-0 flex items-center justify-center shrink-0"
//       }
//     >
//       {createElement(icon, {
//         className: cn({
//           "size-[var(--_sidebar-icon-sm)]": size === "sm",
//           "size-[var(--_sidebar-icon-lg)]": size === "lg",
//         }),
//       })}
//     </span>
//   );
// }

export function SidebarToggleButton() {
  const { isExpanded, toggleSidebarCollapse } = useSidebar();
  return (
    <button className="p-1 cursor-pointer" onClick={toggleSidebarCollapse}>
      <ChevronsRight
        className={cn(
          "size-4 text-gray-500",
          isExpanded ? "-scale-100" : "scale-100"
        )}
      />
    </button>
  );
}
