
import { connectDB, Proveedor } from './_db.js';
export default async function handler(req,res){
 try{
  await connectDB();
  if(req.method==='GET'){ const data=await Proveedor.find().sort({_id:-1}); return res.status(200).json(data); }
  if(req.method==='POST'){ const doc=await Proveedor.create(req.body); return res.status(201).json(doc); }
  return res.status(405).json({error:'Method not allowed'});
 }catch(e){ return res.status(500).json({error:e.message}); }
}
