// models/Shipping.js
import mongoose from 'mongoose';

const ShippingSchema = new mongoose.Schema({
  method: { type: String, required: true },  // e.g., "Standard", "Express"
  deliveryTime: { type: String, required: true },  // e.g., "3-5 business days"
  charge: { type: Number, required: true },  // Shipping cost
}, { timestamps: true });

const Shipping = mongoose.model('Shipping', ShippingSchema);
export default Shipping;
