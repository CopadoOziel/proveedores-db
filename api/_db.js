import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB(){
  if (cached.conn) return cached.conn;
  if (!cached.promise){
    if(!process.env.MONGODB_URI) throw new Error('Falta MONGODB_URI');
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { dbName: 'proveedoresDB' }).then(m=>m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const marcaSchema = new mongoose.Schema({
  nombreMarca: String,
  categoria: String,
  pais: String
}, { collection: 'marcas' });

// AHORA CON TIPO
const ProveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipoProveedor: {
    type: String,
    enum: ['electrico', 'electronico', 'mecanico', 'materia prima', 'general'],
    default: 'general'
  },
  marcas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Marca' }],
  contacto: String,
  telefono: String,
  activo: { type: Boolean, default: true }
}, { timestamps: true });

export const Marca = mongoose.models.Marca || mongoose.model('Marca', marcaSchema);
export const Proveedor = mongoose.models.Proveedor || mongoose.model('Proveedor', ProveedorSchema);
