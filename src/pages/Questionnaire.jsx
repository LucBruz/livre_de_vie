import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import questionsData from "../json/questions.json";
import { supabase } from "../supabaseClient";
import QuestionBlock from "../components/QuestionBlock";
import "./Questionnaire.css";

const QUESTIONS_PER_PAGE = 5;

const Questionnaire = forwardRef((props, ref) => {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(QUESTIONS_PER_PAGE);
  const [observerLoading, setObserverLoading] = useState(false);
  const observerRef = useRef(null);

  // Ici on stocke les réponses remplies localement
  const responsesRef = useRef({});

  // On expose la méthode au parent
  useImperativeHandle(ref, () => ({
    getAllResponses: () => responsesRef.current,
  }));

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
        responsesRef.current[entry.question_id] = entry.content;
      });
      setResponses(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const loadMore = useCallback(() => {
    if (questionIndex >= questionsData.length) return;
    setObserverLoading(true);
    setTimeout(() => {
      setQuestionIndex((prev) =>
        Math.min(prev + QUESTIONS_PER_PAGE, questionsData.length)
      );
      setObserverLoading(false);
    }, 600);
  }, [questionIndex]);

  const lastQuestionRef = useCallback(
    (node) => {
      if (observerLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [observerLoading, loadMore]
  );

  const visibleQuestions = questionsData.slice(0, questionIndex);

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Chargement des réponses…</p>
      </div>
    );
  }

  return (
    <div className="questionnaire">
      <h1>📖 Mon Livre de Vie</h1>
      {visibleQuestions.map((question, idx) => (
        <div
          key={question.id}
          ref={idx === visibleQuestions.length - 1 ? lastQuestionRef : null}
        >
          <QuestionBlock
            question={question}
            defaultContent={responses[question.id] || ""}
            onContentChange={(html) => {
              responsesRef.current[question.id] = html;
            }}
          />
        </div>
      ))}
      {observerLoading && (
        <div className="loading-spinner">
          <p>Chargement des questions suivantes...</p>
        </div>
      )}
    </div>
  );
});

export default Questionnaire;
