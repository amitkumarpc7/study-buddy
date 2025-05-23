import React, { useState } from "react";
import { Note } from "../types";

interface NoteEditorProps {
  note?: Note;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isPreview, setIsPreview] = useState(false);

  const formatText = (format: string) => {
    const textarea = document.getElementById(
      "note-content"
    ) as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "heading":
        formattedText = `# ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => formatText("bold")}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => formatText("italic")}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => formatText("heading")}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
        >
          H
        </button>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm ml-auto"
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {isPreview ? (
        <div
          className="min-h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      ) : (
        <textarea
          id="note-content"
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onSave(title, content)}
          disabled={!title.trim() || !content.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Note
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
