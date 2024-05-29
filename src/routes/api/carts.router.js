import { Router } from 'express'
import cartModel from '../../dao/models/cart.model.js';
import productModel from '../../dao/models/product.model.js';
const HARDCODED_CART_ID = '664796896b11e830d303ac64';

const router = Router();

router.post('/', async (req, res) => {
    const { products } = req.body;

    if (!products) {
        return res.status(400).send({ status: "error", error: "Faltan parámetros: 'products' es requerido" });
    }

    try {
        let result = await cartModel.create({ products });
        res.status(201).send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).send({ status: "error", error: "Error al crear el carrito" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        let cart = await cartModel.findById(cartId).populate('products.id');

        console.log("lo que busco", cart)

        if (!cart) {
            return res.status(404).send({ result: "error", message: "Carrito no encontrado" });
        }

        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "error", message: "Error al obtener el Carrito" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
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

        res.json("cart.products");
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    console.log(`cartId: ${cartId}, productId: ${productId}`);

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            console.log('Carrito no encontrado');
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => String(product.id) === productId);
        if (productIndex === -1) {
            console.log('Producto no encontrado en el carrito');
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.json({ result: "success", payload: cart.products });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).send({ status: "error", error: "Cantidad inválida" });
    }

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        }

        const productInCart = cart.products.find(item => String(item.id) === productId);
        if (productInCart) {
            productInCart.quantity = quantity;
        } else {
            return res.status(404).send({ status: "error", error: "Producto no encontrado en el carrito" });
        }

        await cart.save(); 

        res.send({ status: "success", payload: cart });
    } catch (error) {
        console.error('Error al actualizar el producto en el carrito:', error);
        res.status(500).send({ status: "error", error: "Error al actualizar el producto en el carrito" });
    }
});

router.delete('/:cid', async (req, res) => {
    let { cid } = req.params;

    try {
        let cart = await cartModel.findById(cid);
        
        if (!cart) {
            return res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        cart.products = [];
        await cart.save();

        res.send({ status: "success", payload: cart });
    } catch (error) {
        console.error('Error al eliminar los productos del carrito:', error);
        res.status(500).send({ status: "error", message: "Error al eliminar los productos del carrito" });
    }
});

export default router