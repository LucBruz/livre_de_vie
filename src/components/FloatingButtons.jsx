import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./FloatingButtons.css";

const FloatingButtons = ({ onViewBook }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleDownloadPDF = async () => {
    const pages = document.querySelectorAll(".page");
    if (pages.length === 0) return;

    const pdf = new jsPDF({
      unit: "px",
      format: [600, 900], // taille ajustée à ton flipbook
    });

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, 600, 900);
    }

    pdf.save("mon_livre_de_vie.pdf");
  };

  return (
    <>
      <button className="floating-button logout-button" onClick={handleLogout}>
        🚪 Se déconnecter
      </button>

      {location.pathname === "/livre" ? (
        <>
          <button
            className="floating-button view-book-button"
            onClick={() => navigate("/")}
          >
            ↩️ Retourner aux questions
          </button>
          <button
            className="floating-button download-pdf-button"
            onClick={handleDownloadPDF}
          >
            📄 Télécharger le PDF
          </button>
        </>
      ) : (
        <button
          className="floating-button view-book-button"
          onClick={onViewBook}
        >
          📘 Voir mon livre
        </button>
      )}
    </>
  );
};

export default FloatingButtons;
