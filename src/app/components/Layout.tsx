"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="fixed w-full bg-gray-100 dark:bg-gray-900 shadow-xl h-14 flex items-center justify-between px-4 z-40 lg:hidden">
        <h1
          className={`text-2xl font-bold text-gray-700 dark:text-white transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          Studdy Buddy
        </h1>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out bg-white dark:bg-gray-800 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-7xl mx-auto pt-12 lg:pt-0">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
