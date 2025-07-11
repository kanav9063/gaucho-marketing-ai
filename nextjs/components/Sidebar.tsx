"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarNav from "./SidebarNav";
import SidebarToggle from "./SidebarToggle";
import { useUser } from "@clerk/nextjs";
import UserProfileSection from "./UserProfileSection";
import Image from "next/image";

const MOBILE_WINDOW_WIDTH_LIMIT = 1024;

function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isSignedIn } = useUser();

  const sidebarRef = useRef<HTMLDivElement>(null);

  //  Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const calculatedIsMobile = window.innerWidth < MOBILE_WINDOW_WIDTH_LIMIT;
      setIsMobile(calculatedIsMobile);
      if (calculatedIsMobile) {
        setIsCollapsed(false);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (isMobile && isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobile, isOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const renderMenuIcon = (isOpen: boolean) => {
    return isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />;
  };

  return (
    <div>
      {/* Mobile X toggle in the left side of screen  */}
      {isMobile && (
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className={cn(
            "fixed top-4 left-4 z-50 bg-transparent hover:bg-gray-100/50 backdrop-blur-sm",
            isOpen && "top-4 left-4"
          )}
        >
          {renderMenuIcon(isOpen)}
        </Button>
      )}

      {/* Store all components in nav */}
      {(!isMobile || isOpen) && (
        <div
          ref={sidebarRef}
          className={cn(
            "bg-blue-50 flex flex-col h-screen transition-all duration-300 overflow-y-auto border-r-2 border-blue-100",
            // MOBILE STYLES
            !isMobile
              ? ""
              : `fixed inset-y-0 left-0 z-40 w-64 transform ${
                  isOpen ? "translate-x-0" : "translate-x-full"
                }`,
            // DESKTOP STYLES
            isMobile
              ? ""
              : isCollapsed
              ? "w-28 h-screen sticky top-0"
              : "w-64 h-screen sticky top-0"
          )}
        >
          <div
            className={cn(
              "flex flex-col flex-grow p-6",
              isMobile ? "pt-16" : "pt-10"
            )}
          >
            {!isCollapsed && (
              <>
                <div className="flex justify-center mb-6">
                  <Image
                    src="/images/ucsb-logo.png"
                    alt="UCSB Gaucho"
                    width={150}
                    height={150}
                    className="rounded-lg"
                  />
                </div>
                <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-900 to-yellow-500 bg-clip-text text-transparent">
                  Gaucho AI Marketing
                </h1>
              </>
            )}
            {isCollapsed && (
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/ucsb-logo.png"
                  alt="UCSB Gaucho"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
            )}

            <SidebarNav isMobile={isMobile} isCollapsed={isCollapsed} />
          </div>

          {isSignedIn && (
            <UserProfileSection isMobile={isMobile} isCollapsed={isCollapsed} />
          )}
          {!isMobile && (
            <SidebarToggle
              isCollapsed={isCollapsed}
              toggleSidebar={toggleSidebar}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;
