import React from 'react';
import {KeychainHelper} from 'keychain-helper';

const Login: React.FC = () => {
  const handleLogin = async () => {
    const username = prompt('Ingrese su nombre de usuario de Hive:');
    if (!username) return;

    const message = `Autenticación con Hive Keychain - ${new Date().toISOString()}`;
    KeychainHelper.requestLogin(username,message, async (keychainResponse) => {
        if(keychainResponse.success){
            //continue to send info to backend for verification.
            const responseBE = await fetch('http://localhost:6001/verify', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username, message, signature: keychainResponse.result
                }),
            });
            if(responseBE.status === 200){ //{ success: true, message: 'Firma válida' }
                const result = await responseBE.json();
                if(result.success && result.message === "Firma válida"){
                    alert('Autenticado con exito! Ahora puedes codificar las rutas protegidas y demas!');
                }else{
                    console.log('No se autentico: ',{result});
                }
            }
        }else{
            console.log({keychainResponse});
        }
    });
  };

  return (
    <div>
      <h2>Iniciar Sesión con Hive Keychain</h2>
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
};

export default Login;
