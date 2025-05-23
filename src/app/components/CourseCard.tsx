import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Course } from "../types";

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
}) => {
  const progressColor =
    course.progress >= 80
      ? "bg-green-500"
      : course.progress >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-4 h-4 rounded-full ${course.color}`}></div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-500"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {course.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {course.description}
      </p>

      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
          <div
            className={`${progressColor} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
