import { Router } from 'express'
import cartModel from '../../dao/models/cart.model.js';
import productModel from '../../dao/models/product.model.js';
const HARDCODED_CART_ID = '664796896b11e830d303ac64';
import { isAuthenticated } from '../../middleware/auth.js';

const viewRouter = Router();

viewRouter.use(isAuthenticated);

viewRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        let cart = await cartModel.findById(cartId).populate('products.id').lean();

        if (!cart) {
            return res.status(404).render('error', { message: "Carrito no encontrado" });
        }

        console.log("ESTE ES EL CARRITO", cart)

        res.render('cart', { cart });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "Error al obtener el Carrito" });
    }
});

viewRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid || HARDCODED_CART_ID;
    const productId = req.params.pid;

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productInCart = cart.products.find(product => String(product.id) === productId);
        console.log(productInCart)

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        await cart.save();

    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

export default viewRouter;