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

// Conexión a MongoDB
mongoose
	.connect("mongodb://localhost:27017/ecommerce", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Conectado a MongoDB"))
	.catch((err) => console.error("Error conectando a MongoDB:", err));

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

app.use("/", viewsRouter);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

const PORT = 8080;
const server = app.listen(PORT, () => {
	console.log(`Server escuchando en puerto ${PORT}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
	console.log(`Se ha conectado un cliente con id ${socket.id}`);

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

	socket.on("addProduct", async (productData) => {
		try {
			const newProduct = await productManager.addProduct(productData);
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
			socket.emit("productAdded", newProduct);
		} catch (error) {
			socket.emit("productError", error.message);
		}
	});

	socket.on("deleteProduct", async (productId) => {
		try {
			await productManager.deleteProduct(productId);
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
			socket.emit("productDeleted", productId);
		} catch (error) {
			socket.emit("productError", error.message);
		}
	});
});

export { app, io };
