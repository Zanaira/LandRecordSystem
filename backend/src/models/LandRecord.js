import mongoose from 'mongoose';

const landRecordSchema = new mongoose.Schema({
  plot_number: { type: String, required: true,unique: true },
  khasra_number: { type: String },
  area: { type: Number},
  location: { type: String, required: true },
  land_type: { type: String, enum: ['Agricultural', 'Residential', 'Commercial'], required: true },
  boundary_coordinates: { type: String },
  patwari_notes: { type: String },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  current_owner_name: { type: String, required: true },
  current_owner_cnic: { type: String, required: true ,match: [/^\d{13}$/, 'CNIC must be exactly 13 digits']}
}, { timestamps:true });

export default mongoose.model('LandRecord', landRecordSchema);