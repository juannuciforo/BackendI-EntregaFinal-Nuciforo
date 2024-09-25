import express from 'express';
import ProductManager from '../dao/productManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
    res.redirect('/products');
});

router.get('/products', async (req, res) => {
    const { page = 1, limit = 10, sort, query, category, status } = req.query;
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        query,
        category,
        status
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
        query: { sort, query, category, status }
    });
});

export { router };