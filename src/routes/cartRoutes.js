import express from "express";
import CartManager from "../dao/cartManager.js";

const router = express.Router();
const cartManager = new CartManager();

// POST /api/carts
router.post("/", async (req, res) => {
	try {
		const newCart = await cartManager.createCart();
		res.status(201).json(newCart);
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
	try {
		const cart = await cartManager.getCartById(req.params.cid);
		res.json(cart);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
	try {
		const { quantity } = req.body;
		const updatedCart = await cartManager.addProductToCart(
			req.params.cid,
			req.params.pid,
			quantity
		);
		res.json(updatedCart);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

// DELETE /api/carts/:cid/products/:pid
router.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const updatedCart = await cartManager.removeProductFromCart(
			req.params.cid,
			req.params.pid
		);
		res.json(updatedCart);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

// PUT /api/carts/:cid
router.put("/:cid", async (req, res) => {
	try {
		const updatedCart = await cartManager.updateCart(
			req.params.cid,
			req.body.products
		);
		res.json(updatedCart);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

// PUT /api/carts/:cid/products/:pid
router.put("/:cid/products/:pid", async (req, res) => {
	try {
		const { quantity } = req.body;
		const updatedCart = await cartManager.updateProductQuantity(
			req.params.cid,
			req.params.pid,
			quantity
		);
		res.json(updatedCart);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

// DELETE /api/carts/:cid
router.delete("/:cid", async (req, res) => {
	try {
		const clearedCart = await cartManager.clearCart(req.params.cid);
		res.json(clearedCart);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

export default router;
