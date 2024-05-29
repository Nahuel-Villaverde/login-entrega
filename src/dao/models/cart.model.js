import mongoose, { mongo } from "mongoose";

const cartCollection = "Carritos"

const cartSchema = new mongoose.Schema({
    products: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'Productos', required: true },
            quantity: { type: Number, required: true, default: 1 }
        }
    ]
});

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel