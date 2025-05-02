export interface Tutorial {
    id: string;
    title: string;
    description: string;
    path: string;
  }
  
  export const tutorials: Tutorial[] = [
    {
      id: "01",
      title: "Lector de publicaciones en Hive",
      description: "Aprende a consumir datos desde Hive usando React y TypeScript.",
      path: "/tutorials/01-hive-post-reader/",
    },
  ];
  