import express, {Request,Response} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Client, PublicKey, Signature, cryptoUtils } from '@hiveio/dhive';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = new Client(['https://api.hive.blog']);

app.post('/verify', async (req: Request, res: Response) => {
  // Datos recibidos del cliente
const { username, message, signature: signatureStr } = req.body;

try {
  // Obtener la clave pública del usuario desde la blockchain
  const account = await client.database.getAccounts([username]);
  if (!account || account.length === 0) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const publicKeyData = account[0].posting.key_auths[0][0];
  const publicKeyStr = typeof publicKeyData === 'string' ? publicKeyData : publicKeyData.toString();

  // Crear instancias de PublicKey y Signature
  const publicKey = PublicKey.fromString(publicKeyStr);
  const signature = Signature.fromString(signatureStr);

  // Calcular el hash del mensaje
  const messageHash = cryptoUtils.sha256(message);

  // Verificar la firma
  const isValid = publicKey.verify(messageHash, signature);

  if (isValid) {
    res.status(200).json({ success: true, message: 'Firma válida' });
  } else {
    res.status(401).json({ success: false, message: 'Firma inválida' });
  }
} catch (error) {
  console.error('Error al verificar la firma:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
}
});

app.listen(6001, () => {
  console.log('Servidor backend ejecutándose en http://localhost:6001');
});
