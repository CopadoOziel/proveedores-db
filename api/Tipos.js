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
      // valores por defecto si está vacía
      return res.json([
        { nombre: 'electrico', _id: 'electrico' },
        { nombre: 'electronico', _id: 'electronico' },
        { nombre: 'mecanico', _id: 'mecanico' },
        { nombre: 'materia prima', _id: 'materia prima' },
        { nombre: 'general', _id: 'general' }
      ]);
    }
    return res.json(tipos);
  }
  if(req.method==='POST'){
    const { nombre, descripcion } = req.body;
    const nuevo = await Tipo.create({ nombre: nombre.toLowerCase(), descripcion });
    return res.status(201).json(nuevo);
  }
  if(req.method==='DELETE'){
    // para borrar por id o nombre viene en query
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
