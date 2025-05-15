'use client'

import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import RightSidebar from "./RightSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex overflow-hidden bg-[#F5F5F7] dark:bg-[#121212]">
          {children}
          <RightSidebar />
        </main>
      </div>
      
      <MobileNavigation />
    </div>
  );
}
