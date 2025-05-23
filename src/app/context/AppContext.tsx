"use client";
import React, { createContext, useContext } from "react";
import { User, Course, Note, Deadline } from "../types";

interface AppContextType {
  user: User | null;
  courses: Course[];
  notes: Note[];
  deadlines: Deadline[];
  darkMode: boolean;
  currentPage: string;
  loading: boolean;
  setUser: (user: User | null) => void;
  setCourses: (courses: Course[]) => void;
  setNotes: (notes: Note[]) => void;
  setDeadlines: (deadlines: Deadline[]) => void;
  toggleDarkMode: () => void;
  setCurrentPage: (page: string) => void;
  addCourse: (courseData: Omit<Course, "id" | "createdAt">) => Promise<void>;
  updateCourse: (id: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addNote: (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addDeadline: (deadlineData: Omit<Deadline, "id">) => Promise<void>;
  updateDeadline: (id: string, updates: Partial<Deadline>) => Promise<void>;
  deleteDeadline: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export { AppContext };
