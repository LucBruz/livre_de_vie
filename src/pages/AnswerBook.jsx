import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import "./AnswerBook.css";
import { useLocation, useNavigate } from "react-router-dom";

// Couverture avant stylée
const PageCoverFront = React.forwardRef(({ children }, ref) => (
  <div
    className="page page-cover page-cover-front"
    ref={ref}
    data-density="hard"
  >
    <div className="cover-content">
      <div className="cover-icon">📘</div>
      <h2 className="cover-title">{children}</h2>
    </div>
  </div>
));
PageCoverFront.displayName = "PageCoverFront";

// Couverture arrière stylée
const PageCoverBack = React.forwardRef(({ children }, ref) => (
  <div
    className="page page-cover page-cover-back"
    ref={ref}
    data-density="hard"
  >
    <div className="cover-content">
      <h2 className="cover-title">{children}</h2>
      <p className="cover-quote">
        « Chaque page tournée est une trace de toi. »
      </p>
      <div className="cover-signature">— Ton livre de vie</div>
    </div>
  </div>
));
PageCoverBack.displayName = "PageCoverBack";

// Pages intérieures
const Page = React.forwardRef(({ id, question, content, number }, ref) => (
  <div className="page" ref={ref}>
    <div className="page-content">
      <h4 className="page-header">
        #{id}. {question}
      </h4>
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

  const onFlip = (e) => setCurrentPage(e.data);
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
        <PageCoverFront>Mon Livre de Vie</PageCoverFront>

        {pages.map((p, i) => (
          <Page
            key={i}
            id={p.id}
            question={p.question}
            content={p.content}
            number={i + 1}
          />
        ))}

        <PageCoverBack>Merci pour votre lecture</PageCoverBack>
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
