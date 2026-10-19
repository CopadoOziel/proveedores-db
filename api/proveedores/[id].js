
import { connectDB, Proveedor } from './_db.js';
export default async function handler(req,res){
 try{
  await connectDB();
  const { id } = req.query;
  if(req.method==='PUT'){ const doc=await Proveedor.findByIdAndUpdate(id, req.body, {new:true}); return res.status(200).json(doc); }
  if(req.method==='DELETE'){ await Proveedor.findByIdAndDelete(id); return res.status(200).json({ok:true}); }
  return res.status(405).json({error:'Method not allowed'});
 }catch(e){ return res.status(500).json({error:e.message}); }
}
