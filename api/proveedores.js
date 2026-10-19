import { connectDB, Proveedor } from './_db.js';

export default async function handler(req, res){
  await connectDB();
  if (req.method === 'GET'){
    const { tipo } = req.query;
    const filter = {};
    if (tipo && tipo !== 'todos') filter.tipoProveedor = tipo;
    const proveedores = await Proveedor.find(filter).populate('marcas').sort({ createdAt: -1 });
    return res.json(proveedores);
  }
  if (req.method === 'POST'){
    const { nombre, tipoProveedor, marcas, contacto, telefono } = req.body;
    const nuevo = await Proveedor.create({ nombre, tipoProveedor, marcas, contacto, telefono });
    const populated = await nuevo.populate('marcas');
    return res.status(201).json(populated);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
