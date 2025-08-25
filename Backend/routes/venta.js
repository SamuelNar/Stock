import { Router } from "express";
import { registrarVenta, balanceDiario, balanceGeneral } from "../controllers/ventasController.js";

const router = Router();

router.post("/", registrarVenta); // registrar venta
router.get("/balance/dia", balanceDiario); // balance diario ?fecha=YYYY-MM-DD
router.get("/balance/general", balanceGeneral); // balance general

export default router;
