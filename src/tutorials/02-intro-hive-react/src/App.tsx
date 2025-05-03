// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Client } from '@hiveio/dhive';
import './App.css';
import GlobalPropsExplanation from './components/GlobalPropsExplanation';
import RealtimeBlockFeed from './components/RealtimeBlockFeed';
// >>> COMENTARIO IMPORTANTE: Importamos el nuevo componente del juego
import BlockOperationBettingGame from './components/BlockOperationBettingGame';


const client = new Client('https://api.hive.blog');

function App() {
  const [globalProps, setGlobalProps] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showBlockFeed, setShowBlockFeed] = useState<boolean>(false);
  // >>> COMENTARIO IMPORTANTE: Nuevo estado para controlar la visibilidad del juego
  const [showBettingGame, setShowBettingGame] = useState<boolean>(false);


  useEffect(() => {
    async function fetchGlobalProperties() {
      try {
        setLoading(true);
        setError(null);
        const props = await client.database.getDynamicGlobalProperties();
        setGlobalProps(props);
        console.log('Propiedades Globales (desde App):', props);
      } catch (err: any) {
        console.error('Error fetching global properties (App):', err);
        setError(`Error al conectar o obtener datos iniciales: ${err.message}`);
        setGlobalProps(null);
      } finally {
        setLoading(false);
      }
    }
    fetchGlobalProperties();
  }, []);

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
    // Opcional: Ocultar otros componentes al mostrar este
    // setShowBlockFeed(false);
    // setShowBettingGame(false);
  };

   const toggleBlockFeed = () => {
    setShowBlockFeed(!showBlockFeed);
    // Opcional: Ocultar otros componentes
    // setShowExplanation(false);
    // setShowBettingGame(false);
  };

  // >>> COMENTARIO IMPORTANTE: Función para alternar la visibilidad del juego
  const toggleBettingGame = () => {
    setShowBettingGame(!showBettingGame);
     // Opcional: Ocultar otros componentes
    // setShowExplanation(false);
    // setShowBlockFeed(false);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Tutorial React y Hive</h1>

        {/* Mostrar estado de carga, error o datos iniciales de GlobalProps */}
        {loading && <p>Cargando propiedades globales iniciales...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && globalProps && (
          <div>
            <p>¡Conexión inicial exitosa a Hive!</p>
            <p>Número de Bloque Actual (head_block_number): {globalProps.head_block_number}</p>
            <p>Tiempo del Último Bloque (time): {new Date(globalProps.time + 'Z').toLocaleString()}</p>
          </div>
        )}

        {/* Contenedor para los botones de control */}
        <div style={{ marginTop: '20px' }}>
             {/* Botón para mostrar/ocultar la explicación */}
            <button onClick={toggleExplanation}>
                {showExplanation ? 'Ocultar explicación' : 'Saber más sobre globalProps'}
            </button>

             {/* Botón para mostrar/ocultar el Feed de Bloques */}
            <button onClick={toggleBlockFeed} style={{ marginLeft: '10px' }}>
                 {showBlockFeed ? 'Ocultar Feed de Bloques' : 'Mostrar Feed de Bloques'}
            </button>

            {/* >>> COMENTARIO IMPORTANTE: Botón para mostrar/ocultar el Juego */}
             <button onClick={toggleBettingGame} style={{ marginLeft: '10px' }}>
                 {showBettingGame ? 'Ocultar Juego de Apuestas' : 'Mostrar Juego de Apuestas'}
            </button>
        </div>


      </header>

      {/* Renderizado condicional de los componentes */}
      {showExplanation && <GlobalPropsExplanation />}
      {showBlockFeed && <RealtimeBlockFeed />}
      {/* >>> COMENTARIO IMPORTANTE: Renderizamos el componente del juego aquí */}
      {showBettingGame && <BlockOperationBettingGame />}

    </div>
  );
}

export default App;