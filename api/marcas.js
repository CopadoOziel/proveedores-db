import { connectDB, Marca } from './_db.js';

export default async function handler(req, res){
  await connectDB();
  if (req.method === 'GET'){
    const marcas = await Marca.find().sort({ nombreMarca: 1 });
    return res.json(marcas);
  }
  if (req.method === 'POST'){
    const { nombreMarca, categoria, pais } = req.body;
    const nueva = await Marca.create({ nombreMarca, categoria, pais });
    return res.status(201).json(nueva);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
