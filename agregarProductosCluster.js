import mongoose from "mongoose";
import Product from "./src/models/product.js";

const MONGODB_URI = "mongodb+srv://juannuciforo:0DLcjkqofSFXzSkX@coderhousedb.norii.mongodb.net/?retryWrites=true&w=majority&appName=CoderHouseDB";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const products = [
    { title: "Producto 1", description: "Descripción 1", code: "CODE1", price: 100, stock: 10, category: "Categoría 1", status: true },
    { title: "Producto 2", description: "Descripción 2", code: "CODE2", price: 200, stock: 20, category: "Categoría 2", status: true },
    { title: "Producto 3", description: "Descripción 3", code: "CODE3", price: 300, stock: 30, category: "Categoría 1", status: true },
    { title: "Producto 4", description: "Descripción 4", code: "CODE4", price: 400, stock: 40, category: "Categoría 2", status: true },
    { title: "Producto 5", description: "Descripción 5", code: "CODE5", price: 500, stock: 50, category: "Categoría 1", status: true },
    { title: "Producto 6", description: "Descripción 6", code: "CODE6", price: 600, stock: 60, category: "Categoría 2", status: true },
    { title: "Producto 7", description: "Descripción 7", code: "CODE7", price: 700, stock: 70, category: "Categoría 1", status: true },
    { title: "Producto 8", description: "Descripción 8", code: "CODE8", price: 800, stock: 80, category: "Categoría 2", status: true },
    { title: "Producto 9", description: "Descripción 9", code: "CODE9", price: 900, stock: 90, category: "Categoría 1", status: true },
    { title: "Producto 10", description: "Descripción 10", code: "CODE10", price: 1000, stock: 100, category: "Categoría 2", status: true },
];

async function agregarProductosCluster() {
    try {
        await Product.insertMany(products);
        console.log("Productos de prueba insertados correctamente");
    } catch (error) {
        console.error("Error al insertar productos:", error);
    } finally {
        mongoose.disconnect();
    }
}

agregarProductosCluster();