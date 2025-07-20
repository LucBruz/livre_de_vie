import React, { useEffect, useState } from "react";
import questionsData from "../json/questions.json";
import { supabase } from "../supabaseClient";
import QuestionBlock from "../components/QuestionBlock";
import "./Questionnaire.css";

const Questionnaire = () => {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchResponses = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("responses")
      .select("question_id, content")
      .eq("user_id", user.id);

    if (!error && data) {
      const mapped = {};
      data.forEach((entry) => {
        mapped[entry.question_id] = entry.content;
      });
      setResponses(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  if (loading)
    return <p className="loading-message">Chargement des réponses…</p>;

  return (
    <div className="questionnaire">
      <h1>📖 Mon Livre de Vie</h1>
      {questionsData.map((question) => (
        <QuestionBlock
          key={question.id}
          question={question}
          defaultContent={responses[question.id] || ""}
        />
      ))}
    </div>
  );
};

export default Questionnaire;
