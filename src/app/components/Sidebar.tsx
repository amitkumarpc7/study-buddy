"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { FirebaseService } from "../services/firebase";


const signOut = async () => {
  try {
    await FirebaseService.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const Sidebar: React.FC = () => {
  const { user, darkMode, toggleDarkMode } = useApp();
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Courses",
      href: "/courses",
      icon: BookOpen,
    },
    {
      name: "Notes",
      href: "/notes",
      icon: FileText,
    },
    {
      name: "Deadlines",
      href: "/deadlines",
      icon: Calendar,
    },
  ];

  if (!user) return null;

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="h-full flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Study Buddy
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {user.name}
          </p>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleDarkMode}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg"
          >
            {darkMode ? (
              <>
                <Sun className="mr-3 h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-3 h-5 w-5" />
                Dark Mode
              </>
            )}
          </button>

          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
