import React, { useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Questionnaire from "./pages/Questionnaire";
import AnswerBook from "./pages/AnswerBook";
import questionsData from "./json/questions.json";
import FloatingButtons from "./components/FloatingButtons";

function AppRoutes() {
  const navigate = useNavigate();
  const questionnaireRef = useRef(); // Référence vers le composant Questionnaire

  const handleViewBook = () => {
    // 🔍 Récupérer les réponses depuis le ref
    const responses = questionnaireRef.current?.getAllResponses?.() || {};

    // 📚 Créer les pages formatées à partir des questions et réponses
    const formattedPages = questionsData.map((q) => ({
      question: q.question,
      content: responses[q.id] || "<p>(pas encore rempli)</p>",
    }));

    // 🚀 Naviguer vers la vue livre avec les pages dans le state
    navigate("/livre", { state: { pages: formattedPages } });
  };

  return (
    <>
      {/* Boutons fixes en haut à gauche */}
      <FloatingButtons onViewBook={handleViewBook} />

      <Routes>
        <Route path="/" element={<Questionnaire ref={questionnaireRef} />} />
        <Route path="/livre" element={<AnswerBook />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
