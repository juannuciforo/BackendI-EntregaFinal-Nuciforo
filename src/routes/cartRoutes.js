import express from "express";
import CartManager from "../dao/cartManager.js";
import Product from '../models/product.js';
import mongoose from 'mongoose';

const router = express.Router();
const cartManager = new CartManager();

// POST /api/carts - Se crea un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// GET /api/carts/:cid - Se obtiene un carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// POST /api/carts/:cid/product/:pid - Se agrega un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// DELETE /api/carts/:cid/products/:pid - Se elimina un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// PUT /api/carts/:cid - Se actualiza el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body;
        // Se verifica antes que todos los productos existan
        for (let item of products) {
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({ status: "error", message: `ID de producto inválido: ${item.product}` });
            }
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ status: "error", message: `Producto con id ${item.product} no existe` });
            }
        }
        const updatedCart = await cartManager.updateCart(req.params.cid, products);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// PUT /api/carts/:cid/products/:pid - Se actualiza la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// DELETE /api/carts/:cid - Se eliminan todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    try {
        const clearedCart = await cartManager.clearCart(req.params.cid);
        res.json(clearedCart);
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

export default router;