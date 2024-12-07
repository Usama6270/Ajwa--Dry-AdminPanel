import mongoose from 'mongoose';

const PromotionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    discountPercentage: { type: Number, required: true },
    active: { type: Boolean, default: true },
});

const Promotion = mongoose.model('Promotion', PromotionSchema);

export default Promotion;
