import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  land_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LandRecord', required: true },
  filed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dispute_details: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending' },
  resolution_notes: { type: String },
  resolution_date: { type: Date ,default: Date.now}
}, { timestamps:true });

export default mongoose.model('Dispute', disputeSchema);