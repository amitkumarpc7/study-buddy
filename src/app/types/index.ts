export interface Course {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  url:string;
  createdAt: Date;
}

export interface Note {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deadline {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AppContextType {
  user: User | null;
  courses: Course[];
  notes: Note[];
  deadlines: Deadline[];
  darkMode: boolean;
  currentPage: string;
  setUser: (user: User | null) => void;
  setCourses: (courses: Course[]) => void;
  setNotes: (notes: Note[]) => void;
  setDeadlines: (deadlines: Deadline[]) => void;
  toggleDarkMode: () => void;
  setCurrentPage: (page: string) => void;
  addCourse: (course: Omit<Course, "id" | "createdAt">) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addDeadline: (deadline: Omit<Deadline, "id">) => void;
  updateDeadline: (id: string, updates: Partial<Deadline>) => void;
  deleteDeadline: (id: string) => void;
}
