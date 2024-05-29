import { Router } from 'express'
import productModel from '../../dao/models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let categoria = req.query.categoria;
    let sort = req.query.sort;
    let disponible = req.query.disponible;

    try {
        let filtro = {};
        if (categoria) {
            filtro.categoria = categoria;
        }
        if (disponible !== undefined) {
            filtro.disponible = disponible === 'true';
        }

        let ordenamiento = {};
        if (sort === 'asc') {
            ordenamiento.precio = 1;
        } else if (sort === 'desc') {
            ordenamiento.precio = -1;
        }

        const result = await productModel.paginate(filtro, { page, limit, lean: true, sort: ordenamiento });

        const prevLink = result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}${disponible !== undefined ? `&disponible=${disponible}` : ''}` : null;
        const nextLink = result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}${disponible !== undefined ? `&disponible=${disponible}` : ''}` : null;

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        let product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        res.send({ result: "success", payload: product });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "error", message: "Error al obtener el producto" });
    }
});

router.post('/', async (req, res) => {
    let { titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible } = req.body

    if (!titulo || !descripcion || !precio || !thumbnail || !categoria || !code || stock === undefined || disponible === undefined) {
        return res.send({ status: "error", error: "Faltan parametros" })
    }

    try {
        let result = await productModel.create({ titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible });
        res.status(201).send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).send({ status: "error", error: "Error al crear el producto" });
    }
})

router.put('/:pid', async (req, res) => {
    let { pid } = req.params
    let productToReplace = req.body

    if (!productToReplace.titulo || !productToReplace.descripcion || !productToReplace.precio || !productToReplace.thumbnail || !productToReplace.code || !productToReplace.stock || !productToReplace.disponible) {
        res.send({ status: "error", error: "Parametros no definidos" })
    }
    let result = await productModel.updateOne({ _id: pid }, productToReplace)

    res.send({ result: "success", payload: result })
})

router.delete('/:pid', async (req, res) => {
    let { pid } = req.params
    let result = await productModel.deleteOne({ _id: pid })
    res.send({ result: "success", payload: result })
})

export default router