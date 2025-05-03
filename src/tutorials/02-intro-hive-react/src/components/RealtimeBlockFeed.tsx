// src/components/RealtimeBlockFeed.tsx
import React, { useEffect, useState } from 'react';
import { Client, SignedBlock } from '@hiveio/dhive';
import './RealtimeBlockFeed.css';

const client = new Client('https://api.hive.blog');

interface DisplayBlockInfo extends SignedBlock {
    block_number: number;
}

function RealtimeBlockFeed() {
  const [latestBlocks, setLatestBlocks] = useState<DisplayBlockInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingActive, setIsFetchingActive] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isFetchingActive) {
      setError(null);

      if(latestBlocks.length === 0) {
          setLoading(true);
      }

      intervalId = setInterval(async () => {
        try {
          const props = await client.database.getDynamicGlobalProperties();
          const currentHeadBlock = props.head_block_number;
          const lastDisplayedBlockNumber = latestBlocks[0]?.block_number || 0;

          if (currentHeadBlock > lastDisplayedBlockNumber) {
            const block = await client.database.getBlock(currentHeadBlock);

            if (block) {
                const blockWithNumber: DisplayBlockInfo = {
                    ...block,
                    block_number: currentHeadBlock
                };

                setLatestBlocks(prevBlocks => {
                    const newBlocks = [blockWithNumber, ...prevBlocks];
                    return newBlocks.slice(0, 10);
                });
                setError(null);
            } else {
                 console.warn(`Block ${currentHeadBlock} not found yet on API.`);
            }
          }

        } catch (err: any) {
          console.error("Error fetching block:", err);
          setError(`Error al obtener bloque: ${err.message}`);
        } finally {
            setLoading(false);
        }
      }, 3000); // Polling cada 3 segundos
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFetchingActive]); // Dependencia: isFetchingActive

  const toggleFetching = () => {
    setIsFetchingActive(prev => !prev);
    if (isFetchingActive) {
        setLatestBlocks([]); // Limpiamos la lista al pausar
    }
  };

  const getExplorerBlockUrl = (blockNumber: number) => {
      return `https://hivehub.dev/b/${blockNumber}`;
  }

  return (
    <div className="realtime-block-feed-container">
      <h3>Feed de Bloques de Hive en Tiempo Real</h3>

      {/* >>> COMENTARIO IMPORTANTE: Contenedor para el layout de dos columnas */}
      <div className="feed-layout-container">

          {/* Sección de explicación - Columna Izquierda */}
          <div className="block-feed-explanation">
              <p>
                  Este feed te muestra los bloques más recientes que se están añadiendo a la blockchain de Hive. Cada bloque es como una página de un libro de contabilidad digital que contiene un lote de transacciones (publicaciones, votos, comentarios, transferencias, etc.) que han ocurrido en la red.
              </p>
              <h4>Hive y el Protocolo DPoS: Testigos</h4>
              <p>
                  Hive utiliza un mecanismo de consenso llamado <strong>Delegated Proof of Stake (DPoS)</strong>. En lugar de minería (como Bitcoin) o de que todos los poseedores de tokens validen transacciones (como en algunos sistemas PoS), en Hive, los poseedores de tokens (HIVE) votan por "<strong>Testigos</strong>" (Witnesses).
              </p>
              <p>
                  Los Testigos son nodos de alta disponibilidad operados por miembros de confianza de la comunidad. Los 20 testigos con más votos, más un testigo adicional rotatorio, son los encargados de producir y validar nuevos bloques en turnos programados. ¡Ellos mantienen la cadena funcionando!
              </p>
               <p>
                  Estamos "polleando" (consultando repetidamente) al API de Hive cada 3 segundos para ver cuál es el último bloque producido por un Testigo. Para un feed verdaderamente instantáneo se podría usar un WebSocket, pero este método de polling es más sencillo de demostrar.
              </p>
              <p>
                  Puedes hacer clic en el número de cada bloque para ver todos los detalles y transacciones que contiene en un explorador de bloques externo.
              </p>
          </div>

          {/* Contenedor del Feed (Botón + Lista) - Columna Derecha */}
          {/* >>> COMENTARIO IMPORTANTE: Nuevo contenedor para la columna derecha */}
          <div className="feed-content">
              {/* Botón para iniciar/pausar el feed */}
              <button onClick={toggleFetching} className="control-button">
                {isFetchingActive ? 'Pausar Feed' : 'Iniciar Feed'}
              </button>

              {/* Mostrar estado de carga/error/mensaje inicial */}
              {loading && isFetchingActive && <p>Cargando último bloque...</p>}
              {error && <p className="error-message">{error}</p>}

               {/* Mensaje inicial si no hay bloques y no está activo */}
               {!loading && !error && latestBlocks.length === 0 && !isFetchingActive && (
                    <p>Haz clic en "Iniciar Feed" para ver los últimos bloques de Hive.</p>
               )}

              {/* Mostrar los últimos bloques */}
              {!loading && !error && latestBlocks.length > 0 && (
                <div className="blocks-list">
                  <h4>Últimos Bloques Recibidos:</h4>
                  {latestBlocks.map((block, index) => (
                    <div key={block.block_number} className="block-item">
                      <p>
                        <strong>Bloque #:</strong>
                        <a
                          href={getExplorerBlockUrl(block.block_number)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block-link"
                        >
                            {block.block_number}
                        </a>
                     </p>
                      <p><strong>Tiempo:</strong> {new Date(block.timestamp + 'Z').toLocaleTimeString()}</p>
                      <p><strong>Transacciones:</strong> {block.transactions.length}</p>
                      {index < latestBlocks.length - 1 && <hr className="block-separator" />}
                    </div>
                  ))}
                </div>
              )}
          </div> {/* Fin feed-content */}

      </div> {/* Fin feed-layout-container */}
    </div>
  );
}

export default RealtimeBlockFeed;