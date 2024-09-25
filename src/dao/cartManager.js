import Cart from "../models/cart.js";
import Product from "../models/product.js";

class CartManager {
	async createCart() {
		const newCart = new Cart();
		await newCart.save();
		return newCart;
	}

	async getCartById(id) {
		const cart = await Cart.findById(id).populate("products.product");
		if (!cart) {
			throw new Error("Carrito no encontrado");
		}
		return cart;
	}

	async addProductToCart(cartId, productId, quantity = 1) {
		const cart = await Cart.findById(cartId);
		if (!cart) {
			throw new Error("Carrito no encontrado");
		}

		const product = await Product.findById(productId);
		if (!product) {
			throw new Error("Producto no encontrado");
		}

		const productIndex = cart.products.findIndex(
			(p) => p.product.toString() === productId
		);
		if (productIndex > -1) {
			cart.products[productIndex].quantity += quantity;
		} else {
			cart.products.push({ product: productId, quantity });
		}

		await cart.save();
		return cart;
	}

	async removeProductFromCart(cartId, productId) {
		const cart = await Cart.findById(cartId);
		if (!cart) {
			throw new Error("Carrito no encontrado");
		}

		cart.products = cart.products.filter(
			(p) => p.product.toString() !== productId
		);
		await cart.save();
		return cart;
	}

	async updateCart(cartId, products) {
		const cart = await Cart.findById(cartId);
		if (!cart) {
			throw new Error("Carrito no encontrado");
		}

		cart.products = products;
		await cart.save();
		return cart;
	}

	async updateProductQuantity(cartId, productId, quantity) {
		const cart = await Cart.findById(cartId);
		if (!cart) {
			throw new Error("Carrito no encontrado");
		}

		const productIndex = cart.products.findIndex(
			(p) => p.product.toString() === productId
		);
		if (productIndex === -1) {
			throw new Error("Producto no encontrado en el carrito");
		}

		cart.products[productIndex].quantity = quantity;
		await cart.save();
		return cart;
	}

	async clearCart(cartId) {
		const cart = await Cart.findById(cartId);
		if (!cart) {
			throw new Error("Carrito no encontrado");
		}

		cart.products = [];
		await cart.save();
		return cart;
	}
}

export default CartManager;
