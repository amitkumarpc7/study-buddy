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
  X,
  Compass,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, darkMode, toggleDarkMode, signOut } = useApp();
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
    {
      name: "Course Guide",
      href: "/course-guide",
      icon: Compass,
    },
  ];

  if (!user) return null;

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Mobile close button */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Study Buddy
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-200"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {darkMode ? (
            <>
              <Sun className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Dark Mode
            </>
          )}
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
