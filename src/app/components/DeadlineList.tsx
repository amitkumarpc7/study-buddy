import React, { useState } from "react";
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import AddDeadlineForm from "./AddDeadlineForm";
import { Deadline } from "../types";

const DeadlineList: React.FC = () => {
  const { deadlines, courses, updateDeadline, deleteDeadline } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | null>(null);

  const sortedDeadlines = [...deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const getDeadlineStatus = (deadline: Deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (deadline.completed)
      return {
        status: "completed",
        color: "text-green-500",
        icon: CheckCircle,
      };
    if (daysDiff < 0)
      return { status: "overdue", color: "text-red-500", icon: AlertCircle };
    if (daysDiff <= 1)
      return { status: "urgent", color: "text-orange-500", icon: Clock };
    return { status: "upcoming", color: "text-blue-500", icon: Clock };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Deadlines
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Deadline
        </button>
      </div>

      {showAddForm && <AddDeadlineForm onClose={() => setShowAddForm(false)} />}
      {editingDeadline && (
        <AddDeadlineForm
          deadline={editingDeadline}
          onClose={() => setEditingDeadline(null)}
        />
      )}

      <div className="space-y-3">
        {sortedDeadlines.map((deadline) => {
          const course = courses.find((c) => c.id === deadline.courseId);
          const { color, icon: Icon } = getDeadlineStatus(deadline);

          return (
            <div
              key={deadline.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className={`${color} mt-1`} size={20} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {deadline.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                          deadline.priority
                        )}`}
                      >
                        {deadline.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {deadline.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{course?.name || "Unknown Course"}</span>
                      <span>
                        {new Date(deadline.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateDeadline(deadline.id, {
                        completed: !deadline.completed,
                      })
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      deadline.completed
                        ? "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                        : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {deadline.completed ? "Completed" : "Mark Done"}
                  </button>
                  <button
                    onClick={() => setEditingDeadline(deadline)}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => deleteDeadline(deadline.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeadlineList;
