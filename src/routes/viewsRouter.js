import express from 'express';
import ProductManager from '../dao/productManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await productManager.getProducts({ page, limit });
  res.render('home', { 
    products: result.payload,
    pagination: {
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage
    }
  });
});

router.get('/realtimeproducts', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await productManager.getProducts({ page, limit });
  res.render('realtimeproducts', { 
    products: result.payload,
    pagination: {
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage
    }
  });
});

export { router };