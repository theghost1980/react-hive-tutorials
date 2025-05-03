// src/components/GlobalPropsExplanation.tsx
import React from 'react';
import './GlobalPropsExplanation.css'; // Importamos el archivo CSS

// Componente que explica la importancia de las Propiedades Globales Dinámicas
function GlobalPropsExplanation() {
  return (
    <div className="explanation-container">
      <h3>¿Por qué son importantes las Propiedades Globales Dinámicas?</h3>
      <p>
        Cuando tu aplicación se conecta a la blockchain de Hive, necesitas tener una "foto" del estado actual de la red. Aquí es donde <code>getDynamicGlobalProperties</code> juega un papel crucial.
      </p>
      <p>
        Este método API te proporciona información en tiempo real sobre la cadena, incluyendo:
      </p>
      <ul>
        <li>
          El <strong>número del último bloque validado</strong> (<code>head_block_number</code>) y su <strong>estampa de tiempo</strong> (<code>time</code>). ¡Esto es vital! Te dice si el nodo API al que estás conectado está actualizado y procesando bloques recientes. Si este número no avanza, sabes que hay un problema con tu conexión o el nodo.
        </li>
        <li>
          Datos económicos clave como el <strong>suministro actual</strong> de HIVE y HBD, y el <strong>precio del "feed"</strong> de HIVE/HBD (un precio referencial reportado por los testigos). Esta información puede ser necesaria para mostrar saldos convertidos o entender el estado del mercado interno.
        </li>
        <li>
          Varios <strong>parámetros técnicos</strong> de la red que controlan cosas como los costos de los recursos (Resource Credits), las recompensas por bloque, etc. (Aunque no necesites entender todos estos detalles al principio, saber que están disponibles es útil).
        </li>
      </ul>
      <p>
        En resumen, obtener las propiedades globales dinámicas es a menudo uno de los primeros pasos para asegurar que tu conexión a Hive funciona correctamente y para acceder a datos fundamentales sobre el estado de la red en cualquier momento. Es como tomarle el pulso a la blockchain.
      </p>

      {/* >>> COMENTARIO IMPORTANTE: Nueva sección sobre el uso en Hive Keychain */}
      <h4>Uso en Aplicaciones Reales: Hive Keychain</h4>
      <p>
          Un ejemplo clave de dónde se utilizan las propiedades globales dinámicas es en la extensión de navegador <strong>Hive Keychain</strong>. Aunque parezca simple para el usuario, internamente Keychain necesita conocer el estado actual de la red de Hive para funcionar correctamente.
      </p>
      <p>
          Keychain utiliza <code>getDynamicGlobalProperties</code> para obtener información crucial como:
      </p>
      <ul>
          <li>
              El <strong>ID de la cadena</strong> necesario para firmar transacciones de forma segura.
          </li>
           <li>
              El <strong>número del último bloque</strong> y otros datos del encabezado del bloque para construir y validar transacciones (por ejemplo, definiendo el tiempo de expiración de una transacción en relación con el bloque actual).
          </li>
          <li>
              Parámetros de la red necesarios para ciertas operaciones internas o para mostrar información relevante al usuario sobre el estado de Hive.
          </li>
      </ul>
      <p>
          De hecho, puedes explorar el código fuente de Hive Keychain en GitHub para ver cómo se implementan estas interacciones con el API de Hive. Un buen punto de partida es el archivo que encapsula las llamadas al API de Hive.
          <br/>
           {/* >>> COMENTARIO IMPORTANTE: Enlace al código fuente */}
           <a href="https://github.com/hive-keychain/hive-keychain-extension/blob/master/src/popup/hive/utils/dynamic-global-properties.utils.ts" target="_blank" rel="noopener noreferrer" className="github-link">
               Ver src/api/hive.ts en el repositorio de Hive Keychain en GitHub
           </a>
           <em> (Nota: El código fuente de proyectos externos puede cambiar con el tiempo).</em>
      </p>
      {/* Fin de la nueva sección */}

    </div>
  );
}

export default GlobalPropsExplanation;