// src/components/BlockOperationBettingGame.tsx
import React, { useEffect, useState } from 'react';
import { Client, SignedBlock, OperationName, VirtualOperationName } from '@hiveio/dhive';
import './BlockOperationBettingGame.css';

const client = new Client('https://api.hive.blog');

const commonOperationTypes: (OperationName | VirtualOperationName)[] = [
    'vote',
    'comment',
    'transfer',
    'custom_json',
    'producer_reward',
    'curation_reward',
    'author_reward',
    'transfer_to_vesting',
    'withdraw_vesting',
    'delegate_vesting_shares',
    'claim_reward_balance',
];

// Definimos un tipo para las operaciones que guardaremos, basado en la definición de dhive
type OperationTuple = [OperationName | VirtualOperationName, any];


function BlockOperationBettingGame() {
    const [latestBlockNumber, setLatestBlockNumber] = useState<number | null>(null);
    const [userGuess, setUserGuess] = useState<OperationName | VirtualOperationName | null>(null);
    const [actualMostFrequent, setActualMostFrequent] = useState<{ name: OperationName | VirtualOperationName | null; count: number; tied: (OperationName | VirtualOperationName | null)[] } | null>(null);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [betPlaced, setBetPlaced] = useState<boolean>(false);
    const [fetchNewBlockTrigger, setFetchNewBlockTrigger] = useState<boolean>(true);

    // >>> COMENTARIO IMPORTANTE: Nuevo estado para almacenar la lista de operaciones del bloque
    const [blockOperations, setBlockOperations] = useState<OperationTuple[] | null>(null);


    useEffect(() => {
        if (fetchNewBlockTrigger) {
            const fetchLatestBlockNumber = async () => {
                setIsLoading(true);
                setError(null);
                setResultMessage(null);
                setBetPlaced(false);
                setUserGuess(null);
                setActualMostFrequent(null);
                setBlockOperations(null); // >>> Limpiar lista de ops al cargar nuevo bloque

                try {
                    const props = await client.database.getDynamicGlobalProperties();
                    setLatestBlockNumber(props.head_block_number);
                } catch (err: any) {
                    console.error("Error fetching latest block number:", err);
                    setError(`Error al cargar el número del último bloque: ${err.message}`);
                    setLatestBlockNumber(null);
                } finally {
                    setIsLoading(false);
                    setFetchNewBlockTrigger(false);
                }
            };
            fetchLatestBlockNumber();
        }
    }, [fetchNewBlockTrigger]);


    const handlePlaceBet = async () => {
        if (userGuess === null || latestBlockNumber === null) {
            setError("Por favor, selecciona un tipo de operación antes de apostar.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setBetPlaced(true);
        setResultMessage(null); // Limpiar mensaje de resultado anterior al apostar
        setActualMostFrequent(null); // Limpiar resultado detallado anterior
        setBlockOperations(null); // >>> Limpiar lista de ops anterior al apostar


        try {
            const block = await client.database.getBlock(latestBlockNumber) as SignedBlock | null;

            if (!block) {
                setError(`No se pudo obtener el bloque ${latestBlockNumber}.`);
                setIsLoading(false);
                setActualMostFrequent(null);
                setResultMessage("Error al obtener el bloque. Intenta jugar de nuevo.");
                return;
            }

            const operationCounts = new Map<OperationName | VirtualOperationName | null, number>();
            const operationsList: OperationTuple[] = []; // >>> Lista para guardar todas las operaciones
            let totalOperations = 0;

            block.transactions.forEach(tx => {
                tx.operations.forEach(op => {
                    const opName = op[0];
                    operationsList.push(op as OperationTuple);

                    const currentCount = operationCounts.get(opName) || 0;
                    operationCounts.set(opName, currentCount + 1);
                    totalOperations++;
                });
            });

            // >>> Guardar la lista completa de operaciones en el estado
            setBlockOperations(operationsList);


            let maxCount = 0;
            operationCounts.forEach(count => {
                if (count > maxCount) {
                    maxCount = count;
                }
            });

            const mostFrequentOps: (OperationName | VirtualOperationName | null)[] = [];
            operationCounts.forEach((count, name) => {
                if (count === maxCount && maxCount > 0) {
                    mostFrequentOps.push(name);
                }
            });

            const actualMostFrequentInfo = {
                name: mostFrequentOps.length === 1 ? mostFrequentOps[0] : null,
                count: maxCount,
                tied: mostFrequentOps,
            };


            const userWon = maxCount > 0 && mostFrequentOps.includes(userGuess);
            let message = "";

             if (totalOperations === 0) {
                message = `El bloque ${latestBlockNumber} no tuvo operaciones. ¡Nadie gana!`;
            } else if (maxCount === 0) {
                 message = `El bloque ${latestBlockNumber} tuvo ${totalOperations} operaciones, pero ninguna de los tipos contados.`;
            }
             else if (userWon) {
                 message = `🎉 ¡Ganaste! 🎉 La operación más frecuente${mostFrequentOps.length > 1 ? 's' : ''} fue${mostFrequentOps.length > 1 ? 'ron' : ''} ${mostFrequentOps.filter(op => op !== null).map(op => `'${op}'`).join(', ')} con ${maxCount} ocurrencias${maxCount > 1 ? ' cada una' : ''}.`;
            } else {
                 message = `😞 Perdiste. 😞 La operación más frecuente${mostFrequentOps.length > 1 ? 's' : ''} fue${mostFrequentOps.length > 1 ? 'ron' : ''} ${mostFrequentOps.filter(op => op !== null).map(op => `'${op}'`).join(', ')} con ${maxCount} ocurrencias${maxCount > 1 ? ' cada una' : ''}.`;
            }


            setActualMostFrequent(actualMostFrequentInfo);
            setResultMessage(message);
            setIsLoading(false);

        } catch (err: any) {
            console.error("Error processing block:", err);
            setError(`Error al procesar el bloque: ${err.message}`);
            setIsLoading(false);
            setActualMostFrequent(null);
            setBlockOperations(null); // Limpiar lista de ops si falla el procesamiento
            setResultMessage("Error al procesar el bloque. Intenta jugar de nuevo.");
        }
    };

    const handlePlayAgain = () => {
        setUserGuess(null);
        setActualMostFrequent(null);
        setResultMessage(null);
        setBetPlaced(false);
        setBlockOperations(null); // >>> Limpiar lista de ops al reiniciar
        setFetchNewBlockTrigger(true); // Activar la carga del siguiente bloque
    };


    return (
        <div className="betting-game-container">
            <h3>Adivina la Operación Más Frecuente</h3>

            {isLoading && <p>Cargando datos del juego...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* >>> COMENTARIO IMPORTANTE: Contenedor para el layout de dos columnas */}
            <div className="game-layout-container">

                {/* Sección de explicación - Columna Izquierda */}
                <div className="game-explanation">
                    <p>
                        ¡Bienvenido al juego de apuestas de operaciones de bloque! Aquí, intentarás adivinar qué tipo de operación de Hive aparecerá más veces en el próximo bloque de la blockchain.
                    </p>
                     <p>
                       Cuando haces clic en "Apostar", el juego toma el número del **bloque que se muestra actualmente** (el que se muestra abajo), espera un instante para asegurar que esté procesado en el nodo, y luego revisa todas las transacciones y operaciones dentro de ese bloque. Si tu elección coincide con el tipo de operación que tuvo más ocurrencias en ese bloque, ¡ganas!
                    </p>
                     <p>
                        Selecciona una operación de la lista y haz tu apuesta. Una vez que se muestre el resultado, podrás ver todas las operaciones que contenía ese bloque.
                     </p>
                </div>

                {/* Contenedor principal de la columna derecha (Controles, Resultados, Lista de Ops) */}
                {/* >>> COMENTARIO IMPORTANTE: Nuevo contenedor para la columna derecha */}
                <div className="game-main-content">

                    {/* Controles del juego si no está cargando y tenemos un número de bloque */}
                    {!isLoading && !error && latestBlockNumber !== null && (
                        <div className="game-controls">
                            <p>Aposta en el Bloque: <strong>{latestBlockNumber}</strong></p>

                            {/* Selección de operación - visible si no se ha apostado aún */}
                            {!betPlaced && (
                                <div className="operation-selection">
                                    <label htmlFor="operation-select">Elige tu operación:</label>
                                    <select
                                        id="operation-select"
                                        value={userGuess || ''}
                                        onChange={(e) => setUserGuess(e.target.value as OperationName | VirtualOperationName)}
                                        disabled={isLoading}
                                    >
                                         <option value="" disabled>-- Selecciona una --</option>
                                         {commonOperationTypes.map(opType => (
                                             <option key={opType} value={opType as string}>{opType}</option>
                                         ))}
                                    </select>
                                </div>
                            )}

                            {/* Botón de apostar o Jugar de nuevo */}
                            {!betPlaced && !isLoading && (
                                 <button
                                     onClick={handlePlaceBet}
                                     disabled={userGuess === null}
                                     className="bet-button"
                                 >
                                     Apostar
                                 </button>
                            )}
                             {(betPlaced || (error && !isLoading && latestBlockNumber !== null)) && (
                                <button onClick={handlePlayAgain} className="play-again-button">
                                    Jugar de Nuevo
                                </button>
                            )}
                        </div>
                    )}

                    {/* Mostrar el resultado del juego PERMANENTEMENTE hasta que se juegue de nuevo */}
                    {resultMessage && (
                        <div className={`game-result ${resultMessage.includes('Ganaste') ? 'win' : 'lose'}`}>
                            <p>{resultMessage}</p>
                            {actualMostFrequent !== null && actualMostFrequent.count > 0 && (
                                <p>Conteo de la{actualMostFrequent.tied.length > 1 ? 's' : ''} operación{actualMostFrequent.tied.length > 1 ? 'es' : ''} más frecuente{actualMostFrequent.tied.length > 1 ? 's' : ''}: {actualMostFrequent.count}</p>
                            )}
                        </div>
                    )}

                    {/* >>> COMENTARIO IMPORTANTE: Mostrar la lista de operaciones del bloque después del resultado */}
                    {/* Visible si se ha apostado, no hay errores de carga/procesamiento y tenemos la lista */}
                    {betPlaced && !isLoading && !error && blockOperations && blockOperations.length > 0 && (
                        <div className="block-operations-list">
                            <h4>Operaciones encontradas en Bloque {latestBlockNumber} ({blockOperations.length} total):</h4>
                            <ul>
                                {blockOperations.map((op, index) => (
                                    // La key combina el índice y el nombre de la operación para unicidad
                                    <li key={`${index}-${op[0]}`} className="operation-item">
                                        <strong>{op[0]}</strong> {/* Mostramos solo el nombre de la operación */}
                                         {/* Opcional: Mostrar un resumen del payload (ej: el primer valor) */}
                                         {/* {op[1] && Object.values(op[1]).length > 0 && (
                                             <span>: {Object.values(op[1])[0]?.toString().substring(0, 30)}...</span>
                                         )} */}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                     {/* Mensaje si el juego no pudo cargar el bloque inicial */}
                     {!isLoading && error && latestBlockNumber === null && (
                         <p className="error-message">No se pudo iniciar el juego. Verifica tu conexión.</p>
                     )}

                </div> {/* Fin game-main-content */}

            </div> {/* Fin game-layout-container */}
        </div>
    );
}

export default BlockOperationBettingGame;