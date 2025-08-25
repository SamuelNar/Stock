import express from "express";
import { crearProducto, listarProductos } from "../controllers/productoController.js";

const router = express.Router();

router.post("/", crearProducto);
router.get("/", listarProductos);

export default router;
