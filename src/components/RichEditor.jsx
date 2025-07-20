import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichEditor = ({ initialContent, onChange }) => {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Editor
      key={theme} // 🔁 Force le démontage/remontage du composant à chaque changement de thème
      apiKey="t3r5t96s0cq48fvh3twzdtk0eq9lb00qmi1drh7navv0e9sn"
      initialValue={initialContent}
      onInit={(_, editor) => (editorRef.current = editor)}
      onEditorChange={onChange}
      init={{
        height: 300,
        menubar: false,
        skin: theme === "dark" ? "oxide-dark" : "oxide",
        content_css: theme === "dark" ? "dark" : "default",
        plugins: [
          "autolink",
          "lists",
          "link",
          "image",
          "media",
          "table",
          "wordcount",
          "emoticons",
          "charmap",
          "searchreplace",
          "code",
          "fullscreen",
          "visualblocks",
          "textcolor",
          "colorpicker",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline | " +
          "forecolor backcolor | emoticons charmap | alignleft aligncenter alignright | " +
          "bullist numlist | removeformat",
        color_map: [
          "000000",
          "Noir",
          "e60000",
          "Rouge",
          "ff9900",
          "Orange",
          "ffff00",
          "Jaune",
          "008a00",
          "Vert",
          "0066cc",
          "Bleu",
          "9933ff",
          "Violet",
          "ffffff",
          "Blanc",
        ],
        color_cols: 4,
      }}
    />
  );
};

export default RichEditor;
