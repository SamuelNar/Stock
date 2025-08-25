import { supabase } from "../supabaseClient.js";

// Registrar una venta con varios productos
export const registrarVenta = async (req, res) => {
  try {
    const { productos } = req.body; // [{ producto_id, cantidad }, ...]

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: "Debe enviar al menos un producto" });
    }

    // 1) Crear cabecera de venta con total 0 temporal
    const { data: ventaData, error: ventaError } = await supabase
      .from("ventas")
      .insert([{ total: 0 }])
      .select()
      .single();

    if (ventaError) throw ventaError;
    const ventaId = ventaData.id;

    let totalVenta = 0;

    // 2) Iterar productos y crear detalle
    for (let p of productos) {
      const { producto_id, cantidad } = p;

      // Obtener producto y validar stock
      const { data: producto, error: prodError } = await supabase
        .from("productos")
        .select("*")
        .eq("id", producto_id)
        .single();

      if (prodError) throw prodError;
      if (!producto) return res.status(404).json({ error: `Producto ${producto_id} no encontrado` });
      if (producto.cantidad < cantidad)
        return res.status(400).json({ error: `Stock insuficiente para ${producto.nombre}` });

      // Crear detalle en ventas_productos
      const { data: detalle, error: detalleError } = await supabase
        .from("ventas_productos")
        .insert([
          {
            venta_id: ventaId,
            producto_id,
            cantidad,
            precio_unitario: producto.precio,
          },
        ])
        .select()
        .single();

      if (detalleError) throw detalleError;

      // Actualizar stock
      const { error: updError } = await supabase
        .from("productos")
        .update({ cantidad: producto.cantidad - cantidad })
        .eq("id", producto_id);

      if (updError) throw updError;

      totalVenta += detalle.total;
    }

    // 3) Actualizar total de la venta
    const { data: updatedVenta, error: updVentaError } = await supabase
      .from("ventas")
      .update({ total: totalVenta })
      .eq("id", ventaId)
      .select()
      .single();

    if (updVentaError) throw updVentaError;

    res.status(201).json({ venta: updatedVenta, productos });
  } catch (error) {
    console.error("Error al registrar venta:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Balance diario
export const balanceDiario = async (req, res) => {
  try {
    const { fecha } = req.query; // formato: YYYY-MM-DD
    let query = supabase.from("ventas").select("total, fecha");

    if (fecha) {
      query = query.gte("fecha", `${fecha}T00:00:00`).lte("fecha", `${fecha}T23:59:59`);
    }

    const { data: ventas, error } = await query;
    if (error) throw error;

    const ingresos = ventas.reduce((acc, v) => acc + parseFloat(v.total), 0);

    // Gastos del día
    let gastoQuery = supabase.from("gastos").select("monto, fecha");
    if (fecha) gastoQuery = gastoQuery.gte("fecha", `${fecha}T00:00:00`).lte("fecha", `${fecha}T23:59:59`);
    const { data: gastos, error: gastoError } = await gastoQuery;
    if (gastoError) throw gastoError;

    const totalGastos = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);

    res.json({
      fecha: fecha || new Date().toISOString().slice(0, 10),
      ingresos,
      gastos: totalGastos,
      balance: ingresos - totalGastos,
    });
  } catch (error) {
    console.error("Error balance diario:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Balance general
export const balanceGeneral = async (req, res) => {
  try {
    const { data: ventas, error } = await supabase.from("ventas").select("total");
    if (error) throw error;
    const ingresos = ventas.reduce((acc, v) => acc + parseFloat(v.total), 0);

    const { data: gastos, error: gastoError } = await supabase.from("gastos").select("monto");
    if (gastoError) throw gastoError;
    const totalGastos = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);

    res.json({
      ingresos,
      gastos: totalGastos,
      balance: ingresos - totalGastos,
    });
  } catch (error) {
    console.error("Error balance general:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
