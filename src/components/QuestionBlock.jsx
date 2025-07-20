import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { saveResponseToSupabase } from "../utils/saveResponse";
import Color from "@tiptap/extension-color";
import { CustomHighlight } from "../extensions/CustomHighlight";
import "./QuestionBlock.css";

const COLORS = [
  "#000000",
  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f0f0f0",
];

const Toolbar = ({ editor }) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  if (!editor) return null;

  const applyTextColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setShowTextColor(false);
  };

  const applyHighlight = (color) => {
    editor.chain().focus().setHighlight(color).run();
    setShowHighlight(false);
  };

  return (
    <div className="toolbar">
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <b>B</b>
      </button>
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i>I</i>
      </button>
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </button>
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </button>

      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        🡸
      </button>
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ☰
      </button>
      <button
        className="toolbar-button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        🡺
      </button>

      {/* Text color */}
      <div className="dropdown-wrapper">
        <button
          className="toolbar-button"
          onClick={() => setShowTextColor(!showTextColor)}
        >
          🖍️
        </button>
        {showTextColor && (
          <div className="color-grid">
            {COLORS.map((color, index) => (
              <div
                key={index}
                className="color-cell"
                style={{ backgroundColor: color }}
                onClick={() => applyTextColor(color)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight */}
      <div className="dropdown-wrapper">
        <button
          className="toolbar-button"
          onClick={() => setShowHighlight(!showHighlight)}
        >
          🖌️
        </button>
        {showHighlight && (
          <div className="color-grid">
            {COLORS.map((color, index) => (
              <div
                key={index}
                className="color-cell"
                style={{ backgroundColor: color }}
                onClick={() => applyHighlight(color)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionBlock = ({ question, defaultContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading,
      TextStyle,
      Color,
      CustomHighlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      saveResponseToSupabase({ question_id: question.id, content: html });
    },
  });

  useEffect(() => {
    if (editor && defaultContent) {
      editor.commands.setContent(defaultContent, { emitUpdate: false });
    }
  }, [editor, defaultContent]);

  return (
    <div className="question-block">
      <h3>{question.question}</h3>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default QuestionBlock;
