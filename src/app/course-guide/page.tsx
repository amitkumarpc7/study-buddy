"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { CourseGuideRequest } from "../types";
import Layout from "../components/Layout";
import { Trash2 } from "lucide-react";

const fetchCourseGuide = async (input: string, userId: string) => {
  const res = await fetch("/api/course-guide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, userId }),
  });
  if (!res.ok) throw new Error("Failed to generate roadmap");
  return res.json();
};

const fetchHistory = async (userId: string) => {
  const res = await fetch(`/api/course-guide?userId=${userId}`);
  if (!res.ok) return [];
  return res.json();
};

const deleteHistoryEntry = async (
  userId: string,
  input: string,
  createdAt: string
) => {
  const res = await fetch(`/api/course-guide`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, input, createdAt }),
  });
  if (!res.ok) throw new Error("Failed to delete history entry");
  return res.json();
};

function CourseGuidePage() {
  const { user } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<
    { step: string; description: string }[] | null
  >(null);
  const [suggestedCourses, setSuggestedCourses] = useState<
    { title: string; description: string; url?: string }[]
  >([]);
  const [history, setHistory] = useState<CourseGuideRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchHistory(user.id).then(setHistory);
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourseGuide(input, user.id);
      setRoadmap(data.roadmap);
      setSuggestedCourses(data.suggestedCourses);
      setHistory((prev) => [data, ...prev]);
      setInput("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <span className="inline-block bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600 dark:text-blue-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2v2m0 16v2m8-8h2M2 12H4m15.364-7.364l1.414 1.414M4.222 19.778l1.414-1.414M19.778 19.778l-1.414-1.414M4.222 4.222l1.414 1.414"
            />
          </svg>
        </span>
        AI Course Guide
      </h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 resize-none min-h-[80px] transition-colors"
          placeholder="What do you want to learn? (e.g. 'I want to learn web development from scratch')"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none transition disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? "Generating..." : "Generate Roadmap"}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {roadmap && roadmap.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Learning Roadmap
          </h2>
          <ul className="space-y-2">
            {roadmap.map((stepObj, idx) => (
              <li
                key={idx}
                className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700"
              >
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                  {stepObj.step}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-sm">
                  {stepObj.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestedCourses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Suggested Courses
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="italic font-bold">Note:</span> Some course
            links may be unavailable or in development — we’re improving this!
          </p>
          <ul className="space-y-2">
            {suggestedCourses.map((course, idx) => (
              <li
                key={idx}
                className="bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors group"
              >
                {course.url ? (
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                  >
                    <div className="font-semibold text-blue-700 dark:text-blue-300 group-hover:underline">
                      {course.title}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      {course.description}
                    </div>
                  </a>
                ) : (
                  <>
                    <div className="font-semibold text-blue-700 dark:text-blue-300">
                      {course.title}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      {course.description}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Past Course Requests
        </h2>
        {history.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">
            No past requests yet.
          </div>
        ) : (
          <ul className="space-y-4">
            {history.map((req, idx) => (
              <li
                key={idx}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 relative"
              >
                <button
                  title="Delete entry"
                  onClick={async () => {
                    if (!user?.id) return;
                    try {
                      await deleteHistoryEntry(
                        user.id,
                        req.input,
                        req.createdAt as any
                      );
                      setHistory((prev) => prev.filter((h, i) => i !== idx));
                    } catch (e) {
                      setError("Failed to delete entry");
                    }
                  }}
                  className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <Trash2 size={18} />
                </button>
                <div className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(req.createdAt).toLocaleString()}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Input:</span> {req.input}
                </div>

                <div className="mb-2">
                  <span className="font-semibold">Roadmap:</span>
                  <ul className="list-disc pl-5 mt-1">
                    {req.roadmap?.map((step, i) => (
                      <li key={i}>
                        <strong>{step.step}:</strong> {step.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-semibold">Suggested Courses:</span>
                  <ul className="list-disc pl-5">
                    {req.suggestedCourses.map((c, i) => (
                      <li key={i}>
                        {c.url ? (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-100"
                          >
                            <span className="font-semibold">{c.title}:</span>{" "}
                            {c.description}
                          </a>
                        ) : (
                          <>
                            <span className="font-semibold">{c.title}:</span>{" "}
                            {c.description}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function CourseGuide() {
  return (
    <Layout>
      <CourseGuidePage />
    </Layout>
  );
}
