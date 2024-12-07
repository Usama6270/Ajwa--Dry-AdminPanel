import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    redeemed: { type: Boolean, default: false },
});

const Voucher = mongoose.model('Voucher', VoucherSchema);

export default Voucher;
