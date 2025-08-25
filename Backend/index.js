import express from "express";
import cors from "cors";
import productosRoutes from "./routes/productos.js";
import ventasRoutes from "./routes/venta.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRoutes);

/*
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
