import mongoose from 'mongoose';

const ownershipHistorySchema = new mongoose.Schema({
  land_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LandRecord', required: true },
  previous_owner_name: { type: String },
  previous_owner_cnic: { type: String, match: [/^\d{13}$/] },
  new_owner_name: { type: String, required: true },
  new_owner_cnic: { type: String, required: true, match: [/^\d{13}$/] },
  transaction_date: { type: Date, required: true },
  transaction_amount: { type: Number },
  documents_uploaded: { type: Boolean, default: false },
  recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('OwnershipHistory', ownershipHistorySchema);