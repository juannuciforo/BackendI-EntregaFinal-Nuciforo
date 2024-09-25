import express from "express";
import ProductManager from "../dao/productManager.js";

const router = express.Router();
const productManager = new ProductManager();

// GET /api/products
router.get("/", async (req, res) => {
	try {
		const { limit, page, sort, query } = req.query;
		const result = await productManager.getProducts({ limit, page, sort, query });
		res.json(result);
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
	try {
		const product = await productManager.getProductById(req.params.pid);
		res.json(product);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

// POST /api/products
router.post("/", async (req, res) => {
	try {
		const newProduct = await productManager.addProduct(req.body);
		req.app.get("io").emit("updateProducts", await productManager.getProducts());
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(400).json({ status: "error", message: error.message });
	}
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
	try {
		const updatedProduct = await productManager.updateProduct(
			req.params.pid,
			req.body
		);
		req.app.get("io").emit("updateProducts", await productManager.getProducts());
		res.json(updatedProduct);
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
	try {
		await productManager.deleteProduct(req.params.pid);
		req.app.get("io").emit("updateProducts", await productManager.getProducts());
		res
			.status(200)
			.json({
				status: "success",
				message: `Producto con id ${req.params.pid} eliminado`,
			});
	} catch (error) {
		res.status(404).json({ status: "error", message: error.message });
	}
});

export default router;
