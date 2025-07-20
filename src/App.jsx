import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./pages/Auth";
import ToggleMode from "./components/ToggleMode";
import LogoutButton from "./components/LogoutButton";
import Questionnaire from "./pages/Questionnaire";

function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const stayLoggedIn = localStorage.getItem("stayLoggedIn") === "true";
      const navigationType =
        performance.getEntriesByType("navigation")[0]?.type;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Cas : session présente mais l'utilisateur ne voulait pas rester connecté
      if (session && !stayLoggedIn && navigationType === "navigate") {
        await supabase.auth.signOut();
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(session);
      setIsLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) return null;

  return (
    <>
      <ToggleMode />
      {session ? (
        <>
          <LogoutButton />
          <Questionnaire />
        </>
      ) : (
        <Auth onLogin={() => window.location.reload()} />
      )}
    </>
  );
}

export default App;
