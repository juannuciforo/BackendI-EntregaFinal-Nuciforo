	import Product from "../models/product.js";

	class ProductManager {
		async getProducts(options = {}) {
			const { limit = 10, page = 1, sort, query, category } = options;
			const skip = (parseInt(page) - 1) * parseInt(limit);

			let filter = {};
			if (category) filter.category = category;
			if (query) {
				filter.$or = [
					{ title: { $regex: query, $options: 'i' } },
					{ description: { $regex: query, $options: 'i' } }
				];
			}

			const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

			try {
				const totalProducts = await Product.countDocuments(filter);
				const products = await Product.find(filter)
					.sort(sortOption)
					.skip(skip)
					.limit(parseInt(limit))
					.select('title description code price stock category') // Asegúrate de incluir 'code' aquí
					.lean();

				const totalPages = Math.ceil(totalProducts / parseInt(limit));
				const hasPrevPage = parseInt(page) > 1;
				const hasNextPage = parseInt(page) < totalPages;

				return {
					status: 'success',
					payload: products,
					totalPages,
					prevPage: hasPrevPage ? parseInt(page) - 1 : null,
					nextPage: hasNextPage ? parseInt(page) + 1 : null,
					page: parseInt(page),
					hasPrevPage,
					hasNextPage,
					prevLink: hasPrevPage ? `/products?page=${parseInt(page) - 1}&limit=${limit}&sort=${sort}&query=${query}&category=${category}` : null,
					nextLink: hasNextPage ? `/products?page=${parseInt(page) + 1}&limit=${limit}&sort=${sort}&query=${query}&category=${category}` : null
				};
			} catch (error) {
				console.error("Error en getProducts:", error);
				return { status: 'error', message: error.message };
			}
		}

		async addProduct(productData) {
			const { title, description, code, price, stock, category } = productData;
			if (!title || !description || !code || !price || !stock || !category) {
				throw new Error("Todos los campos son obligatorios");
			}
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
			try {
				const product = await Product.findByIdAndDelete(id);
				if (!product) {
					throw new Error("Producto no encontrado");
				}
				console.log('Producto eliminado de la base de datos:', id);
				return product;
			} catch (error) {
				console.error("Error en deleteProduct:", error);
				throw error;
			}
		}
	}

	export default ProductManager;
