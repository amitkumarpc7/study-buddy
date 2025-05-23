import React, { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";
import CourseCard from "./CourseCard";
import CourseForm from "./CourseForm";
import { Course } from "../types";

const CoursesPage: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your courses and track your progress
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Course
        </button>
      </div>

      {(showAddForm || editingCourse) && (
        <CourseForm
          course={editingCourse}
          onSave={(courseData) => {
            if (editingCourse) {
              updateCourse(editingCourse.id, courseData);
              setEditingCourse(null);
            } else {
              addCourse({
                ...courseData,
                color: colors[Math.floor(Math.random() * colors.length)],
              });
              setShowAddForm(false);
            }
          }}
          onCancel={() => {
            setShowAddForm(false);
            setEditingCourse(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={() => setEditingCourse(course)}
            onDelete={() => deleteCourse(course.id)}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start by adding your first course to track your learning progress.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
