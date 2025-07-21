import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Auth from "./pages/Auth";
import ToggleMode from "./components/ToggleMode";
import AppRoutes from "./AppRoutes";

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
    <BrowserRouter>
      <ToggleMode />
      {session ? (
        <AppRoutes />
      ) : (
        <Auth onLogin={() => window.location.reload()} />
      )}
    </BrowserRouter>
  );
}

export default App;
