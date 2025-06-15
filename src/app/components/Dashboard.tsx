import React from "react";
import { BookOpen, FileText, Calendar, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import Link from "next/link";

const Dashboard: React.FC = () => {
  const { courses, notes, deadlines } = useApp();

  const upcomingDeadlines = deadlines
    .filter((d) => !d.completed)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  const recentNotes = notes
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, course) => sum + course.progress, 0) /
            courses.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2">
          Welcome back! Here&apos;s your learning overview.
        </p>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Link href="/courses" passHref>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Courses
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {courses.length}
                </p>
              </div>
              <BookOpen className="text-blue-500" size={24} />
            </div>
          </div>
        </Link>

        <Link href="/notes">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Total Notes
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {notes.length}
                </p>
              </div>
              <FileText className="text-green-500" size={24} />
            </div>
          </div>
        </Link>
        <Link href="/deadlines">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Pending Deadlines
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {deadlines.filter((d) => !d.completed).length}
                </p>
              </div>
              <Calendar className="text-orange-500" size={24} />
            </div>
          </div>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Avg Progress
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {averageProgress}%
              </p>
            </div>
            <CheckCircle className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming deadlines
              </p>
            ) : (
              upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {deadline.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {new Date(deadline.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      deadline.priority === "high"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : deadline.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                    }`}
                  >
                    {deadline.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Notes
          </h2>
          <div className="space-y-3">
            {recentNotes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
            ) : (
              recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {note.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {/* {new Date(note.updatedAt).toLocaleDateString()} */}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
