import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./Auth.css";

const Auth = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("stayLoggedIn");
    setStayLoggedIn(stored !== "false");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    localStorage.setItem("stayLoggedIn", stayLoggedIn ? "true" : "false");

    const result = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
    } else {
      onLogin();
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Inscription" : "Connexion"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />

        <label className="auth-checkbox-label">
          <input
            type="checkbox"
            checked={stayLoggedIn}
            onChange={() => setStayLoggedIn(!stayLoggedIn)}
          />
          Rester connecté
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="button" style={{ width: "100%" }}>
          {isSignUp ? "S'inscrire" : "Se connecter"}
        </button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        {isSignUp ? "Déjà inscrit ? " : "Pas encore de compte ? "}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="auth-toggle-button"
        >
          {isSignUp ? "Connexion" : "Créer un compte"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
