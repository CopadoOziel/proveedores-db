import { connectDB } from './_db.js';
import mongoose from 'mongoose';

const TipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: String
}, { collection: 'tiposProveedor', timestamps: true });

const Tipo = mongoose.models.TipoProveedor || mongoose.model('TipoProveedor', TipoSchema);

export default async function handler(req,res){
  await connectDB();
  if(req.method==='GET'){
    const tipos = await Tipo.find().sort({ nombre: 1 });
    if(tipos.length===0){
      return res.status(200).json([
        { nombre: 'electrico', _id: 'electrico', descripcion: 'Material eléctrico' },
        { nombre: 'electronico', _id: 'electronico', descripcion: 'Componentes electrónicos' },
        { nombre: 'mecanico', _id: 'mecanico', descripcion: 'Herramienta mecánica' },
        { nombre: 'materia prima', _id: 'materia prima', descripcion: 'Materia prima' },
        { nombre: 'general', _id: 'general', descripcion: 'General' }
      ]);
    }
    return res.status(200).json(tipos);
  }
  if(req.method==='POST'){
    try{
      const { nombre, descripcion } = req.body;
      if(!nombre) return res.status(400).json({ error: 'nombre requerido' });
      const nombreNorm = nombre.toLowerCase().trim();
      const existe = await Tipo.findOne({ nombre: nombreNorm });
      if(existe) return res.status(200).json(existe);
      const nuevo = await Tipo.create({ nombre: nombreNorm, descripcion: (descripcion||'').trim() });
      return res.status(201).json(nuevo);
    }catch(e){
      if(e.code===11000){
        const existente = await Tipo.findOne({ nombre: req.body.nombre.toLowerCase().trim() });
        return res.status(200).json(existente);
      }
      return res.status(500).json({ error: e.message });
    }
  }
  if(req.method==='DELETE'){
    const { id } = req.query;
    if(!id) return res.status(400).json({error:'falta id'});
    try{
      await Tipo.findByIdAndDelete(id);
    }catch{
      await Tipo.findOneAndDelete({ nombre: id });
    }
    return res.json({ok:true});
  }
  return res.status(405).json({error:'Method not allowed'});
}
