import { connectDB, AppConfig } from './_db.js';
import crypto from 'crypto';

const SALT = 'proveedoresDB_salt_2026_DAGAL';
const ITERATIONS = 100000;
const KEYLEN = 32;
const DIGEST = 'sha256';

// Hash seguro con PBKDF2, no guarda la contraseña en texto
function hashPassword(password){
  const derived = crypto.pbkdf2Sync(password, SALT, ITERATIONS, KEYLEN, DIGEST);
  return derived.toString('hex');
}

// Contraseña inicial solicitada: Dagal2026DBProveeñ
// Si no existe config, la crea hasheada (solo una vez)
async function ensureSeed(){
  let cfg = await AppConfig.findOne({ clave: 'view_password' });
  if(!cfg){
    const initialPwd = 'Dagal2026DBProveeñ';
    const h = hashPassword(initialPwd);
    cfg = await AppConfig.create({ clave: 'view_password', hash: h, salt: SALT });
  }
  return cfg;
}

export default async function handler(req, res){
  await connectDB();
  if(req.method === 'GET'){
    // Solo para verificar si existe config, no devuelve hash
    await ensureSeed();
    return res.status(200).json({ ok: true, seeded: true });
  }
  if(req.method === 'POST'){
    try{
      const { password } = req.body;
      if(!password) return res.status(400).json({ error: 'Falta password' });
      const cfg = await ensureSeed();
      const incomingHash = hashPassword(password);
      // Comparación en tiempo constante
      const match = crypto.timingSafeEqual(Buffer.from(incomingHash, 'hex'), Buffer.from(cfg.hash, 'hex'));
      if(match){
        // Token simple de sesión, no es JWT, solo para que el frontend sepa que pasó
        const token = crypto.randomBytes(16).toString('hex');
        return res.status(200).json({ ok: true, token });
      } else {
        return res.status(401).json({ ok: false, error: 'Contraseña incorrecta' });
      }
    }catch(e){
      return res.status(500).json({ error: e.message });
    }
  }
  if(req.method === 'PUT'){
    // Cambiar contraseña (requiere password actual)
    try{
      const { currentPassword, newPassword } = req.body;
      if(!currentPassword || !newPassword) return res.status(400).json({ error: 'Faltan datos' });
      const cfg = await ensureSeed();
      const incomingHash = hashPassword(currentPassword);
      const match = crypto.timingSafeEqual(Buffer.from(incomingHash, 'hex'), Buffer.from(cfg.hash, 'hex'));
      if(!match) return res.status(401).json({ error: 'Actual incorrecta' });
      cfg.hash = hashPassword(newPassword);
      await cfg.save();
      return res.status(200).json({ ok: true });
    }catch(e){ return res.status(500).json({ error: e.message }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
