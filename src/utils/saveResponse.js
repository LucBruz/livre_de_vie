import { supabase } from "../supabaseClient";

export const saveResponseToSupabase = async ({ question_id, content }) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Utilisateur non connecté.");
    return;
  }

  const { error } = await supabase.from("responses").upsert([
    {
      user_id: user.id,
      question_id,
      content,
    },
  ]);

  if (error) {
    console.error("Erreur lors de l’enregistrement :", error.message);
  } else {
    console.log(`Réponse à la question ${question_id} sauvegardée !`);
  }
};
