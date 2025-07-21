import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./AnswerBook.css";
import { useLocation, useNavigate } from "react-router-dom";

// Page de couverture (avant / arrière)
const PageCover = React.forwardRef(({ children }, ref) => (
  <div className="page page-cover" ref={ref} data-density="hard">
    <div className="page-content">
      <h2>{children}</h2>
    </div>
  </div>
));
PageCover.displayName = "PageCover";

// Page intérieure avec contenu
const Page = React.forwardRef(({ question, content, number }, ref) => (
  <div className="page" ref={ref}>
    <div className="page-content">
      <h4 className="page-header">📝 {question}</h4>
      <div
        className="page-text"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="page-footer">Page {number}</div>
    </div>
  </div>
));
Page.displayName = "Page";

const AnswerBook = () => {
  const bookRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const pages = location.state?.pages || [];

  const onFlip = (e) => {
    setCurrentPage(e.data);
  };

  const next = () => bookRef.current?.pageFlip().flipNext();
  const prev = () => bookRef.current?.pageFlip().flipPrev();

  if (!pages.length) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Aucune donnée fournie.</p>
        <button onClick={() => navigate("/")}>⬅️ Retour</button>
      </div>
    );
  }

  return (
    <div className="book-container">
      <HTMLFlipBook
        width={400}
        height={600}
        size="stretch"
        minWidth={300}
        maxWidth={600}
        minHeight={400}
        maxHeight={900}
        showCover={true}
        maxShadowOpacity={0.5}
        mobileScrollSupport={true}
        drawShadow={true}
        flippingTime={1000}
        useMouseEvents={true}
        className="book"
        ref={bookRef}
        onFlip={onFlip}
      >
        <PageCover>📘 Mon Livre de Vie</PageCover>

        {pages.map((p, i) => (
          <Page
            key={i}
            question={p.question}
            content={p.content}
            number={i + 1}
          />
        ))}

        <PageCover>📖 Merci pour votre lecture</PageCover>
      </HTMLFlipBook>

      <div className="book-controls">
        <button onClick={prev} disabled={currentPage === 0}>
          ⬅️ Précédent
        </button>
        <button onClick={next} disabled={currentPage >= pages.length + 1}>
          Suivant ➡️
        </button>
      </div>
    </div>
  );
};

export default AnswerBook;
