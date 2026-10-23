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
  nombreMarca: { type: String, required: true },
  categoria: { type: String, default: 'General' },
  pais: { type: String, default: '' }
}, { collection: 'marcas', timestamps: true });

const ProveedorSchema = new mongoose.Schema({
  nombreProveedor: { type: String, required: true },
  nombre: { type: String },
  tipoProveedor: { type: String, default: 'general' },
  marcas: [String],
  contacto: String,
  telefono: String,
  correo: String,
  ciudad: String,
  ubicacion: String,
  direccion: String,
  estatus: { type: String, default: 'Activo' },
  activo: { type: Boolean, default: true }
}, { collection: 'proveedores', timestamps: true });

const TipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: String,
  color: { type: String, default: 'general' }
}, { collection: 'tiposProveedor', timestamps: true });

const AppConfigSchema = new mongoose.Schema({
  clave: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true }
}, { collection: 'appConfig', timestamps: true });

export const Marca = mongoose.models.Marca || mongoose.model('Marca', marcaSchema);
export const Proveedor = mongoose.models.Proveedor || mongoose.model('Proveedor', ProveedorSchema);
export const TipoProveedor = mongoose.models.TipoProveedor || mongoose.model('TipoProveedor', TipoSchema);
export const AppConfig = mongoose.models.AppConfig || mongoose.model('AppConfig', AppConfigSchema);
