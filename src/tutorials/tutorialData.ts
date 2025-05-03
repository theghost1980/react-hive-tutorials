export interface Tutorial {
    id: string;
    title: string;
    description: string;
    path: string;
    readmeRelativePath: string;
  }
  
  export const tutorials: Tutorial[] = [
    {
      id: "01",
      title: "Lector de publicaciones en Hive",
      description: "Aprende a consumir datos desde Hive usando React y TypeScript.",
      path: "/tutorials/01-hive-post-reader/",
      readmeRelativePath: "./01-hive-post-reader/README.md",
    },
    {
      id: "02",
      title: "Introducción: React y Hive, Primeros Pasos",
      description: "Configuración y usos de Dhive en react",
      path: "/tutorials/02-intro-hive-react/",
      readmeRelativePath: "./02-intro-hive-react/README.md",
    }
  ];
  