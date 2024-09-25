import Product from "../models/product.js";

class ProductManager {
	async getProducts(options = {}) {
		const { limit = 10, page = 1, sort, query } = options;
		const filter = {};
		if (query) {
			filter.$or = [
				{ title: { $regex: query, $options: "i" } },
				{ description: { $regex: query, $options: "i" } },
			];
		}

		const sortOption =
			sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

		const result = await Product.paginate(filter, {
			limit,
			page,
			sort: sortOption,
			lean: true,
		});

		return {
			status: "success",
			payload: result.docs,
			totalPages: result.totalPages,
			prevPage: result.prevPage,
			nextPage: result.nextPage,
			page: result.page,
			hasPrevPage: result.hasPrevPage,
			hasNextPage: result.hasNextPage,
			prevLink: result.hasPrevPage
				? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}`
				: null,
			nextLink: result.hasNextPage
				? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}`
				: null,
		};
	}

	async addProduct(productData) {
		const newProduct = new Product(productData);
		await newProduct.save();
		return newProduct;
	}

	async getProductById(id) {
		const product = await Product.findById(id);
		if (!product) {
			throw new Error("Producto no encontrado");
		}
		return product;
	}

	async updateProduct(id, updatedFields) {
		const product = await Product.findByIdAndUpdate(id, updatedFields, {
			new: true,
		});
		if (!product) {
			throw new Error("Producto no encontrado");
		}
		return product;
	}

	async deleteProduct(id) {
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			throw new Error("Producto no encontrado");
		}
		return product;
	}
}

export default ProductManager;
