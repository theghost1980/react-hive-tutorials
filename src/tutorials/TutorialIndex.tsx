import React, { useState } from "react";
import { Tutorial, tutorials } from "./tutorialData";
import ReactMarkdown from "react-markdown";

const markdownFiles = import.meta.glob('./*/README.md', { as: 'raw' });

const TutorialIndex: React.FC = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);

  const handleTutorialClick = async (tutorial: Tutorial): Promise<void> => {
    const readmeKey = tutorial.readmeRelativePath;

    const importReadme = markdownFiles[readmeKey];

    if (!importReadme) {
      console.error(`README.md not found for path: ${readmeKey}`);
      setMarkdownContent("# Error\nCould not load the README file.");
      setSelectedTutorial(tutorial);
      return;
    }

    showLoadingState();

    try {
      const content: string = await importReadme();
      setMarkdownContent(content);
      setSelectedTutorial(tutorial);
    } catch (error) {
      console.error(`Error loading README.md for ${readmeKey}:`, error);
      setMarkdownContent("# Error\nCould not load the README file.");
      setSelectedTutorial(tutorial);
    } finally {
       hideLoadingState();
    }
  };

  const closeModal = (): void => {
    setSelectedTutorial(null);
    setMarkdownContent(null);
  };

  const showLoadingState = () => { };
  const hideLoadingState = () => { };

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Tutoriales Hive + React
      </h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tutorials.map((tutorial) => (
          <li
            key={tutorial.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div>
               <button
                 onClick={() => handleTutorialClick(tutorial)}
                 style={{
                   fontSize: "1.2rem",
                   color: "#2563eb",
                   textDecoration: "none",
                   background: 'none',
                   border: 'none',
                   padding: 0,
                   cursor: 'pointer',
                   textAlign: 'left',
                 }}
               >
                 {tutorial.title}
               </button>
               <p style={{ marginTop: "0.5rem", color: "#444" }}>{tutorial.description}</p>
            </div>
          </li>
        ))}
      </ul>
      {selectedTutorial && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
            overflowY: "auto",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              textAlign: "left",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="modal-title">{selectedTutorial.title}</h2>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close README modal"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            {markdownContent !== null ? (
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
            ) : (
                <div>Cargando o contenido no disponible...</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default TutorialIndex;