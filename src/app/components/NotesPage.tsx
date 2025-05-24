import React, { useState } from "react";
import { Plus, Edit2, Trash2, FileText } from "lucide-react";
import { useApp } from "../context/AppContext";
import NoteEditor from "./NoteEditor";
import { Note } from "../types";

const NotesPage: React.FC = () => {
  const { notes, courses, addNote, updateNote, deleteNote } = useApp();
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedCourse, setSelectedCourse] = useState("");

  const filteredNotes = selectedCourse
    ? notes.filter((note) => note.courseId === selectedCourse)
    : notes;

  const handleSaveNote = (title: string, content: string) => {
    if (editingNote) {
      updateNote(editingNote.id, { title, content, updatedAt: new Date() });
      setEditingNote(null);
    } else {
      if (!selectedCourse) return;
      addNote({
        courseId: selectedCourse,
        title,
        content,
      });
    }
    setShowEditor(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Organize your thoughts and study materials
          </p>
        </div>
        <button
          onClick={() => {
            if (courses.length === 0) {
              alert("Please add a course first before creating notes");
              return;
            }
            setSelectedCourse(courses[0].id);
            setShowEditor(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={16} />
          New Note
        </button>
      </div>

      {/* Course Filter */}
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by course:
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {showEditor && (
        <NoteEditor
          note={editingNote || undefined}
          onSave={handleSaveNote}
          onCancel={() => {
            setShowEditor(false);
            setEditingNote(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => {
          const course = courses.find((c) => c.id === note.courseId);
          return (
            <div
              key={note.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {note.title}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingNote(note);
                      setSelectedCourse(note.courseId);
                      setShowEditor(true);
                    }}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {course?.name || "Unknown Course"}
              </p>

              <div className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {note.content.length>150?`{note.content.substring(0, 150)}...`:note.content}
                
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start taking notes to organize your learning materials.
          </p>
          {courses.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add a course first to start taking notes.
            </p>
          ) : (
            <button
              onClick={() => {
                setSelectedCourse(courses[0].id);
                setShowEditor(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Your First Note
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
