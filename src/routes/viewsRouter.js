import express from 'express';
import ProductManager from '../dao/productManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
    res.redirect('/products');
});

router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { sort, query, category } = req.query;
        
        const options = {
            page,
            limit,
            sort,
            query,
            category
        };
        
        const result = await productManager.getProducts(options);
        
        res.render('products', { 
            products: result.payload,
            pagination: {
                page: result.page,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                nextPage: result.nextPage,
                prevPage: result.prevPage
            },
            query: { ...req.query, page, limit }
        });
    } catch (error) {
        console.error("Error en la ruta /products:", error);
        res.status(500).render('error', { error: 'Error al cargar los productos' });
    }
});

export { router };