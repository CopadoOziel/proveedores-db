import { connectDB, Marca } from './_db.js';
export default async function handler(req, res){
  await connectDB();
  if (req.method === 'GET'){
    const marcas = await Marca.find().sort({ nombreMarca: 1 });
    return res.status(200).json(marcas);
  }
  if (req.method === 'POST'){
    try{
      const { nombreMarca, categoria, pais } = req.body;
      if(!nombreMarca) return res.status(400).json({ error: 'nombreMarca requerido' });
      const existe = await Marca.findOne({ nombreMarca: { $regex: `^${nombreMarca.trim()}$`, $options: 'i' } });
      if(existe) return res.status(200).json(existe);
      const nueva = await Marca.create({ nombreMarca: nombreMarca.trim(), categoria: (categoria||'General').trim(), pais: (pais||'').trim() });
      return res.status(201).json(nueva);
    }catch(e){ return res.status(500).json({ error: e.message }); }
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
