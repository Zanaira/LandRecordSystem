import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  land_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LandRecord', required: true },
  ownership_history_id: { type: mongoose.Schema.Types.ObjectId, ref: 'OwnershipHistory' },
  dispute_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dispute' },
  document_type: { type: String, required: true },
  file_path: { type: String, required: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps:true });

export default mongoose.model('Document', documentSchema);
