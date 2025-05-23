"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../context/AppContext";
import { Course, Note, Deadline, User } from "../types";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "../firebaseconfig";
import { CourseColors } from "../constants";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
    setIsInitialized(true);
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (!isInitialized) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode, isInitialized]);

  // Auth state listener
  useEffect(() => {
    if (!isInitialized) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.data();

        const userDataToSet: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name:
            userData?.name ||
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "",
        };
        setUser(userDataToSet);
        setupRealtimeListeners(firebaseUser.uid);
      } else {
        setUser(null);
        setCourses([]);
        setNotes([]);
        setDeadlines([]);
        router.push("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, isInitialized]);

  const setupRealtimeListeners = (userId: string) => {
    // Courses listener
    const coursesQuery = query(
      collection(db, "courses"),
      where("userId", "==", userId)
    );
    const coursesUnsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    });

    // Notes listener
    const notesQuery = query(
      collection(db, "notes"),
      where("userId", "==", userId)
    );
    const notesUnsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(notesData);
    });

    // Deadlines listener
    const deadlinesQuery = query(
      collection(db, "deadlines"),
      where("userId", "==", userId)
    );
    const deadlinesUnsubscribe = onSnapshot(deadlinesQuery, (snapshot) => {
      const deadlinesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Deadline[];
      setDeadlines(deadlinesData);
    });

    // Return cleanup function
    return () => {
      coursesUnsubscribe();
      notesUnsubscribe();
      deadlinesUnsubscribe();
    };
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      //   setUser(null);
      router.push("/");
    } catch (error: unknown) {
      console.error("Error signing out:", error);
      setLoading(false);
    }
  };

  // Course operations
  const addCourse = async (courseData: Omit<Course, "id" | "createdAt">) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "courses"), {
        ...courseData,
        userId: user.id,
        createdAt: serverTimestamp(),
        color: CourseColors[Math.floor(Math.random() * CourseColors.length)],
      });
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  };

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      await updateDoc(doc(db, "courses", id), updates);
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await deleteDoc(doc(db, "courses", id));
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  };

  // Note operations
  const addNote = async (
    noteData: Omit<Note, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "notes"), {
        ...noteData,
        userId: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding note:", error);
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      await updateDoc(doc(db, "notes", id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  };

  // Deadline operations
  const addDeadline = async (deadlineData: Omit<Deadline, "id">) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "deadlines"), {
        ...deadlineData,
        userId: user.id,
        dueDate: deadlineData.dueDate.toISOString(),
      });
    } catch (error) {
      console.error("Error adding deadline:", error);
      throw error;
    }
  };

  const updateDeadline = async (id: string, updates: Partial<Deadline>) => {
    try {
      const dataToUpdate: any = { ...updates };
      if (updates.dueDate) {
        dataToUpdate.dueDate = updates.dueDate.toISOString();
      }
      await updateDoc(doc(db, "deadlines", id), dataToUpdate);
    } catch (error) {
      console.error("Error updating deadline:", error);
      throw error;
    }
  };

  const deleteDeadline = async (id: string) => {
    try {
      await deleteDoc(doc(db, "deadlines", id));
    } catch (error) {
      console.error("Error deleting deadline:", error);
      throw error;
    }
  };

  const value = {
    user,
    courses,
    notes,
    deadlines,
    darkMode,
    currentPage,
    loading,
    setUser,
    setCourses,
    setNotes,
    setDeadlines,
    toggleDarkMode,
    setCurrentPage,
    addCourse,
    updateCourse,
    deleteCourse,
    addNote,
    updateNote,
    deleteNote,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    signOut,
  };

  if (!isInitialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
