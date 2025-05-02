import React from "react";
import { tutorials } from "./tutorialData";

const TutorialIndex: React.FC = () => {
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
            <a
              href={tutorial.path}
              style={{ fontSize: "1.2rem", color: "#2563eb", textDecoration: "none" }}
            >
              {tutorial.title}
            </a>
            <p style={{ marginTop: "0.5rem", color: "#444" }}>{tutorial.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default TutorialIndex;
