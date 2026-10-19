import { connectDB } from './_db.js';
import mongoose from 'mongoose';
const TipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: String,
  color: { type: String, default: 'general' }
}, { collection: 'tiposProveedor', timestamps: true });
const Tipo = mongoose.models.TipoProveedor || mongoose.model('TipoProveedor', TipoSchema);
export default async function handler(req,res){
  await connectDB();
  if(req.method==='GET'){
    const tipos = await Tipo.find().sort({ nombre: 1 });
    if(tipos.length===0){
      return res.status(200).json([
        { nombre: 'electrico', _id: 'electrico', color: 'electrico' },
        { nombre: 'electronico', _id: 'electronico', color: 'electronico' },
        { nombre: 'mecanico', _id: 'mecanico', color: 'mecanico' },
        { nombre: 'materia prima', _id: 'materia prima', color: 'materia' },
        { nombre: 'general', _id: 'general', color: 'general' }
      ]);
    }
    return res.status(200).json(tipos);
  }
  if(req.method==='POST'){
    try{
      const { nombre, descripcion, color } = req.body;
      if(!nombre) return res.status(400).json({ error: 'nombre requerido' });
      const nombreNorm = nombre.toLowerCase().trim();
      const colorFinal = (color||nombreNorm).toLowerCase().trim();
      const existe = await Tipo.findOne({ nombre: nombreNorm });
      if(existe){
        existe.color = colorFinal;
        if(descripcion) existe.descripcion = descripcion;
        await existe.save();
        return res.status(200).json(existe);
      }
      const nuevo = await Tipo.create({ nombre: nombreNorm, descripcion: (descripcion||'').trim(), color: colorFinal });
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
    try{ await Tipo.findByIdAndDelete(id); }catch{ await Tipo.findOneAndDelete({ nombre: id }); }
    return res.json({ok:true});
  }
  return res.status(405).json({error:'Method not allowed'});
}
