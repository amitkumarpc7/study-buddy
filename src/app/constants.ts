// src/constants.ts

import { Course, Deadline, Note } from "./types";

// Available colors for courses
export const CourseColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-fuchsia-500",
  "bg-rose-500",
] as const;

// Priority options for deadlines
export const PriorityOptions = [
  {
    value: "low",
    label: "Low",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  },
  {
    value: "medium",
    label: "Medium",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    value: "high",
    label: "High",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
] as const;

// Default course data for initialization
export const DEFAULT_COURSE: Omit<Course, "id" | "createdAt"> = {
  name: "",
  description: "",
  progress: 0,
  color: CourseColors[0],
};

// Default note data for initialization
export const DEFAULT_NOTE: Omit<Note, "id" | "createdAt" | "updatedAt"> = {
  courseId: "",
  title: "",
  content: "",
};

// Default deadline data for initialization
export const DEFAULT_DEADLINE: Omit<Deadline, "id"> = {
  courseId: "",
  title: "",
  description: "",
  dueDate: new Date(),
  completed: false,
  priority: "medium",
};

// Status colors for deadlines
export const DeadlineStatusColors = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  urgent:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

// Navigation items for sidebar
export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "Home" },
  { id: "courses", label: "Courses", icon: "BookOpen" },
  { id: "notes", label: "Notes", icon: "FileText" },
  { id: "deadlines", label: "Deadlines", icon: "Calendar" },
] as const;

// Date format options
export const DATE_FORMATS = {
  short: "MMM d, yyyy",
  long: "EEEE, MMMM d, yyyy",
  withTime: "MMM d, yyyy h:mm a",
};
