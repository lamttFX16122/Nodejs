const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const orderSchema = new Scheme({
    products: [{
        product: {
            type: Object,
            required: true
        },
        quantity: { type: Number, required: true }
    }],
    user: {
        username: {
            type: String,
            required: true
        },
        userId: {
            type: Scheme.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }
})
module.exports = mongoose.model('Order', orderSchema);