import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./FloatingButtons.css";

const FloatingButtons = ({ onViewBook }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <>
      <button className="logout-button" onClick={handleLogout}>
        🚪 Se déconnecter
      </button>

      {location.pathname === "/livre" ? (
        <button className="view-book-button" onClick={() => navigate("/")}>
          ↩️ Retourner aux questions
        </button>
      ) : (
        <button className="view-book-button" onClick={onViewBook}>
          📘 Voir mon livre
        </button>
      )}
    </>
  );
};

export default FloatingButtons;
