// models/Tax.js
import mongoose from 'mongoose';

const TaxSchema = new mongoose.Schema({
  region: { type: String, required: true },  // e.g., "California"
  taxRate: { type: Number, required: true },  // e.g., 0.07 (7%)
});

const Tax = mongoose.model('Tax', TaxSchema);
export default Tax;
