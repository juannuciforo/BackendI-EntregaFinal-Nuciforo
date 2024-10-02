import __dirname from "./utils.js";
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { router as viewsRouter } from "./routes/viewsRouter.js";
import ProductManager from "./dao/productManager.js";

const app = express();
const productManager = new ProductManager();

// Conexión a MongoDB Atlas
const MONGODB_URI = "mongodb+srv://juannuciforo:0DLcjkqofSFXzSkX@coderhousedb.norii.mongodb.net/?retryWrites=true&w=majority&appName=CoderHouseDB";

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Conectado a MongoDB Atlas"))
	.catch((err) => console.error("Error conectando a MongoDB Atlas:", err));

// Configuración de Handlebars
app.engine(
	"handlebars",
	engine({
		layoutsDir: path.join(__dirname, "views/layouts"),
		defaultLayout: "main",
	})
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = 8080;
const server = app.listen(PORT, () => {
	console.log(`Server escuchando en puerto ${PORT}`);
});

const io = new Server(server);

// Middleware para hacer io accesible en las rutas
app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use("/", viewsRouter);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

io.on("connection", (socket) => {
	console.log(`Se ha conectado un cliente con id ${socket.id}`);

	// Se emiten actualizaciones de productos
	const emitProductUpdate = async () => {
		const result = await productManager.getProducts({ page: 1, limit: 10 });
		io.emit("updateProducts", {
			products: result.payload,
			pagination: {
				page: result.page,
				totalPages: result.totalPages,
				hasNextPage: result.hasNextPage,
				hasPrevPage: result.hasPrevPage,
				nextPage: result.nextPage,
				prevPage: result.prevPage,
			},
		});
	};

	socket.on("requestProducts", async ({ page, limit }) => {
		try {
			const result = await productManager.getProducts({ page, limit });
			socket.emit("updateProducts", {
				products: result.payload,
				pagination: {
					page: result.page,
					totalPages: result.totalPages,
					hasNextPage: result.hasNextPage,
					hasPrevPage: result.hasPrevPage,
					nextPage: result.nextPage,
					prevPage: result.prevPage,
				},
			});
		} catch (error) {
			socket.emit("productError", error.message);
		}
	});

	socket.on('addProduct', async (productData) => {
		try {
			await productManager.addProduct(productData);
			await emitProductUpdate();
			socket.emit('productAdded', 'Producto agregado exitosamente');
		} catch (error) {
			console.error('Error al agregar producto:', error);
			socket.emit('productError', error.message || 'Error desconocido al agregar el producto');
		}
	});
	
	socket.on('deleteProduct', async (productId) => {
		try {
			await productManager.deleteProduct(productId);
			await emitProductUpdate();
			socket.emit('productDeleted', 'Producto eliminado exitosamente');
		} catch (error) {
			console.error('Error al eliminar producto:', error);
			socket.emit('productError', error.message || 'Error al eliminar el producto');
		}
	});
});

export { app, io };