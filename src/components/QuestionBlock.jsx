import React from "react";
import { saveResponseToSupabase } from "../utils/saveResponse";
import RichEditor from "./RichEditor"; // Assure-toi que ce fichier existe
import "./QuestionBlock.css";

const QuestionBlock = ({ question, defaultContent }) => {
  const handleEditorChange = (content) => {
    saveResponseToSupabase({ question_id: question.id, content });
  };

  return (
    <div className="question-block">
      <h3>{question.question}</h3>
      <RichEditor
        initialContent={defaultContent}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default QuestionBlock;
