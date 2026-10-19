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
      // evitar duplicados
      const existe = await Marca.findOne({ nombreMarca: { $regex: `^${nombreMarca}$`, $options: 'i' } });
      if(existe) return res.status(200).json(existe);
      const nueva = await Marca.create({ nombreMarca: nombreMarca.trim(), categoria: (categoria||'General').trim(), pais: (pais||'').trim() });
      return res.status(201).json(nueva);
    }catch(e){
      if(e.code===11000) return res.status(200).json({ error: 'ya existe' });
      return res.status(500).json({ error: e.message });
    }
  }
  if (req.method === 'DELETE'){
    const { id } = req.query;
    await Marca.findByIdAndDelete(id);
    return res.json({ ok: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
