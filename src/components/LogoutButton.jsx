import React from "react";
import { supabase } from "../supabaseClient";
import "./LogoutButton.css";

const LogoutButton = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur de déconnexion :", error.message);
    } else {
      window.location.reload(); // Recharge pour afficher l'écran de login
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      🔒 Se déconnecter
    </button>
  );
};

export default LogoutButton;
