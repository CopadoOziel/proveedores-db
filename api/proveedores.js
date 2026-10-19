import { connectDB, Proveedor } from './_db.js';
export default async function handler(req, res){
  await connectDB();
  if (req.method === 'GET'){
    const { tipo } = req.query;
    const filter = {};
    if (tipo && tipo !== 'todos') filter.tipoProveedor = tipo;
    const proveedores = await Proveedor.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(proveedores);
  }
  if (req.method === 'POST'){
    try{
      const { nombreProveedor, nombre, tipoProveedor, marcas, contacto, telefono, ciudad, estatus } = req.body;
      const nombreFinal = (nombreProveedor || nombre || '').trim();
      if(!nombreFinal) return res.status(400).json({ error: 'nombreProveedor requerido' });
      let tipoFinal = (tipoProveedor || 'general').toLowerCase().trim();
      const nuevo = await Proveedor.create({
        nombreProveedor: nombreFinal,
        nombre: nombreFinal,
        tipoProveedor: tipoFinal,
        marcas: Array.isArray(marcas) ? marcas : [],
        contacto: (contacto||'').trim(),
        telefono: (telefono||'').trim(),
        ciudad: (ciudad||'').trim(),
        estatus: estatus || 'Activo'
      });
      return res.status(201).json(nuevo);
    }catch(e){ return res.status(500).json({ error: e.message }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
