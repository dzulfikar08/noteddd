"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { TopBar } from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  const [notes, setNotes] = useState<{ id: number; title: string; createdAt: string }[]>([]);


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar  />
            <MainContent  />
        </div>
      </div>
    </SidebarProvider>
  );
}
