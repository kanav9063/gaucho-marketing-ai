import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarToggleProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

function SidebarToggle({ isCollapsed, toggleSidebar }: SidebarToggleProps) {
  return (
    <div
      className={cn(
        "flex border-t-2 border-yellow-200",
        isCollapsed ? "p-4 justify-center" : "p-4 justify-end"
      )}
    >
      <Button
        variant="ghost"
        onClick={toggleSidebar}
        className={cn(
          "text-gray-800 hover:text-yellow-600 hover:bg-yellow-50 transition-colors",
          isCollapsed && "self-center"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default SidebarToggle;
