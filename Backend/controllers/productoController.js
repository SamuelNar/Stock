import { supabase } from "../supabaseClient.js";

// Crear producto
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, precio, categoria } = req.body;

    if (!nombre || precio === undefined) {
      return res.status(400).json({ error: "Nombre y precio son obligatorios" });
    }

    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          nombre,
          descripcion,
          cantidad,
          precio,
          categoria,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Error al crear producto:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Listar productos
export const listarProductos = async (req, res) => {
  try {
    const { data, error } = await supabase.from("productos").select("*");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error al listar productos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
