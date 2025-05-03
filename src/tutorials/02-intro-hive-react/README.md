# 📖 Tutorial 02 – Introducción: React y Hive, Primeros Pasos

¡Hola y bienvenido/a al segundo tutorial de nuestra serie!

En esta serie, vamos a aprender a integrar aplicaciones web construidas con React con la blockchain de Hive. Si ya te sientes cómodo/a trabajando con React y sus conceptos (componentes, estado, hooks como `useState` y `useEffect`), pero eres nuevo/a en el desarrollo para Hive, ¡estás en el lugar correcto!

Este tutorial servirá como nuestro campamento base. Vamos a poner a punto nuestro entorno y a dar los primeros pasos para que tu aplicación React pueda empezar a comunicarse con la fascinante red de Hive.

## 🚀 ¿Qué vamos a hacer?

En este primer tutorial, cubriremos los fundamentos esenciales para establecer una conexión y obtener datos básicos de Hive desde nuestro proyecto React:

* **Prepararemos nuestro entorno:** Partiremos de un proyecto React básico (como el que tienes configurado con Vite y TypeScript) y añadiremos la librería esencial para interactuar con Hive desde JavaScript/TypeScript: **`@hiveio/dhive`**. También nos aseguraremos de que las definiciones de tipos de TypeScript estén correctas.
* **Estableceremos nuestra primera conexión:** Aprenderemos a configurar un cliente de `@hiveio/dhive` apuntando a un nodo público de la red de Hive. Este será nuestro canal de comunicación con la blockchain.
* **Obtendremos datos públicos esenciales:** Exploraremos cómo obtener las "propiedades globales dinámicas" de la cadena (como el número del último bloque, el tiempo, etc.) y entenderemos por qué esta información es importante (¡incluso veremos un ejemplo de cómo aplicaciones reales como Hive Keychain la utilizan!).
* **Construiremos un feed de bloques:** Crearemos un componente React que muestre los bloques más recientes de la blockchain de Hive en "tiempo real" (usando una técnica común de polling). Esto nos dará una visión práctica de la actividad constante en la red y nos permitirá hablar un poco sobre el mecanismo de consenso DPoS y el papel de los Testigos en la producción de bloques.
* **Desarrollaremos un mini-juego interactivo:** Pondremos en práctica lo aprendido construyendo un simple juego donde podrás apostar sobre la operación más frecuente en un bloque reciente. Esto nos servirá para aprender a obtener los detalles completos de un bloque específico y a analizar las transacciones y operaciones que contiene.
* **Organizaremos nuestro código:** Mantendremos nuestro proyecto limpio y modularizando nuestra aplicación en componentes de React y gestionando sus estilos en archivos CSS separados.
* **Reforzaremos conceptos de React:** Usaremos hooks de estado (`useState`) para manejar la información dinámica que obtenemos de Hive y el hook `useEffect` para realizar llamadas a la API de forma eficiente y controlar el ciclo de vida de nuestros datos.

Al finalizar este tutorial, tendrás una base sólida para interactuar con la blockchain de Hive desde tu aplicación React y estarás listo/a para sumergirte en temas más avanzados, como la lectura de publicaciones y la autenticación.

## 📦 Estructura de carpetas

```
tutorials/
└── 02-intro-hive-react/
    ├── src/
    │   ├── components/       <-- Carpeta para nuestros componentes reutilizables
    │   │   ├── BlockOperationBettingGame.css  <-- Estilos del juego
    │   │   ├── BlockOperationBettingGame.tsx  <-- Componente del juego
    │   │   ├── GlobalPropsExplanation.css     <-- Estilos de la explicación
    │   │   ├── GlobalPropsExplanation.tsx     <-- Componente de la explicación
    │   │   ├── RealtimeBlockFeed.css          <-- Estilos del feed de bloques
    │   │   └── RealtimeBlockFeed.tsx          <-- Componente del feed de bloques
    │   ├── App.css           <-- Estilos generales de la aplicación
    │   ├── App.tsx           <-- Nuestro componente principal modificado
    │   └── main.tsx          <-- Archivo de entrada de Vite/React
    ├── README.md             <-- Archivo para describir este tutorial (opcional pero recomendado)
    ├── index.html            <-- Archivo HTML principal (generado por Vite)
    ├── package.json          <-- Archivo de configuración del proyecto con dependencias
    └── tsconfig.json          <-- Archivo de configuración para typescript
```

🔧 Próximos pasos
¡Felicidades por completar el primer tutorial! Ya sabes cómo conectar tu app React a Hive, obtener datos esenciales y hasta jugar un poco analizando bloques. Para seguir construyendo sobre esta base y aumentar tus habilidades, considera explorar lo siguiente:

- Leer y mostrar Publicaciones de Hive: Este es un paso lógico y muy común. Aprender cómo usar @hiveio/dhive para obtener listas de publicaciones (por ejemplo, las publicaciones de "trending" o de una categoría/tag específico) y mostrarlas de manera atractiva en tu interfaz React. Podrías expandir el feed de bloques para mostrar también las operaciones de comment (posts y comentarios).
- Integrar Autenticación con Hive Keychain: La lectura de datos es solo una parte. Para poder votar, comentar, publicar o transferir, necesitas que los usuarios autentiquen y firmen transacciones de forma segura. Hive Keychain es la herramienta estándar en el ecosistema para esto en aplicaciones web. Integrarla es un paso crucial.
Realizar tus Primeras Operaciones de Escritura: Una vez que tengas la autenticación funcionando, intenta implementar acciones sencillas como votar en una publicación o comentario. Luego, podrías pasar a acciones más complejas como publicar un nuevo post o enviar una pequeña cantidad de HIVE/HBD a otra cuenta.
- Explorar el Contenido Detallado de las Operaciones: En el juego de apuestas, solo analizamos el nombre de la operación. Puedes modificar el feed de bloques o el juego para desplegar o mostrar información clave del "payload" (op[1]) de las operaciones más comunes (por ejemplo, el autor y permlink de un vote, el memo de un transfer, el contenido de un custom_json).
- Usar APIs en Tiempo Real con WebSockets: El feed de bloques actual utiliza "polling" (pide datos repetidamente). Para aplicaciones que requieren actualizaciones instantáneas (como monitorear transacciones de una cuenta), las APIs de Hive ofrecen conexiones WebSocket que "empujan" los datos nuevos a tu aplicación tan pronto como ocurren. Investigar cómo conectar y escuchar estos flujos de datos sería un gran avance.
- Obtener Información Específica de Usuarios: Usa @hiveio/dhive para obtener el perfil completo de un usuario, su historial de publicaciones (blog), su historial de votos, o incluso su saldo (requiere autenticación para saldos privados).
- Mejorar la Gestión de Estado: A medida que tu aplicación crezca, manejar el estado con muchos useState puede volverse complicado. Explorar bibliotecas de gestión de estado más avanzadas como React Context, Redux, Zustand, etc., y cómo integrarlas con tus llamadas a la API de Hive sería muy beneficioso.

Estos pasos te permitirán profundizar en la interacción con Hive y construir aplicaciones React más completas y funcionales. ¡El camino del desarrollo blockchain es vasto y emocionante!

---

## 💬 ¿Dudas o feedback?

¡Comenta abajo o contactame por [PeakD](https://peakd.com/@theghost1980)!