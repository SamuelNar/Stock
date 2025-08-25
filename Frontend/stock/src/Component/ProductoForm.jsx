import { useState } from "react";
import { createProduct } from "../services/api";
import { Package, Tag, Layers, DollarSign, Grid, Save, Plus, AlertCircle, CheckCircle } from "lucide-react";

const ProductForm = () => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    cantidad: "",
    precio: "",
    categoria: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido";
    if (!form.cantidad || parseInt(form.cantidad) < 0) newErrors.cantidad = "Cantidad debe ser mayor o igual a 0";
    if (!form.precio || parseFloat(form.precio) < 0) newErrors.precio = "Precio debe ser mayor o igual a 0";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const productData = {
        ...form,
        cantidad: parseInt(form.cantidad) || 0,
        precio: parseFloat(form.precio) || 0
      };
      
      await createProduct(productData);
      
      // Success feedback
      const successMessage = "🎉 Producto creado con éxito";
      alert(successMessage);
      
      // Reset form
      setForm({ 
        nombre: "", 
        descripcion: "", 
        cantidad: "", 
        precio: "", 
        categoria: "" 
      });
      
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error al crear el producto. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const predefinedCategories = [
    "Electrónicos", "Ropa", "Hogar", "Deportes", "Libros", 
    "Juguetes", "Comida", "Salud", "Automóvil", "Música"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Nuevo Producto
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Agrega productos a tu inventario</p>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Información del Producto</h2>
          </div>

          <div className="space-y-6" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nombre del Producto *
              </label>
              <div className={`relative flex items-center border-2 rounded-xl px-4 py-3 transition-all duration-300 bg-white/80 ${
                errors.nombre 
                  ? "border-red-300 focus-within:ring-4 focus-within:ring-red-100" 
                  : "border-gray-200 focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500"
              }`}>
                <Tag className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  name="nombre"
                  placeholder="Ej: Laptop Dell Inspiron 15"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full outline-none text-gray-700 bg-transparent"
                  required
                />
              </div>
              {errors.nombre && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nombre}
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Descripción
              </label>
              <div className="relative border-2 border-gray-200 rounded-xl p-4 transition-all duration-300 bg-white/80 focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500">
                <textarea
                  name="descripcion"
                  placeholder="Descripción detallada del producto (opcional)"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="w-full outline-none text-gray-700 bg-transparent resize-none"
                  rows="4"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">
                💡 Una buena descripción ayuda a identificar mejor el producto
              </p>
            </div>

            {/* Cantidad y Precio en grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cantidad */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Cantidad en Stock *
                </label>
                <div className={`relative flex items-center border-2 rounded-xl px-4 py-3 transition-all duration-300 bg-white/80 ${
                  errors.cantidad 
                    ? "border-red-300 focus-within:ring-4 focus-within:ring-red-100" 
                    : "border-gray-200 focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500"
                }`}>
                  <Layers className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="number"
                    name="cantidad"
                    placeholder="0"
                    value={form.cantidad}
                    onChange={handleChange}
                    min="0"
                    className="w-full outline-none text-gray-700 bg-transparent"
                    required
                  />
                </div>
                {errors.cantidad && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cantidad}
                  </div>
                )}
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Precio Unitario *
                </label>
                <div className={`relative flex items-center border-2 rounded-xl px-4 py-3 transition-all duration-300 bg-white/80 ${
                  errors.precio 
                    ? "border-red-300 focus-within:ring-4 focus-within:ring-red-100" 
                    : "border-gray-200 focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500"
                }`}>
                  <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="number"
                    step="0.01"
                    name="precio"
                    placeholder="0.00"
                    value={form.precio}
                    onChange={handleChange}
                    min="0"
                    className="w-full outline-none text-gray-700 bg-transparent"
                    required
                  />
                </div>
                {errors.precio && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.precio}
                  </div>
                )}
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Categoría
              </label>
              <div className="relative flex items-center border-2 border-gray-200 rounded-xl px-4 py-3 transition-all duration-300 bg-white/80 focus-within:ring-4 focus-within:ring-purple-100 focus-within:border-purple-500">
                <Grid className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  name="categoria"
                  placeholder="Ej: Electrónicos, Ropa, Hogar..."
                  value={form.categoria}
                  onChange={handleChange}
                  list="categorias"
                  className="w-full outline-none text-gray-700 bg-transparent"
                />
                <datalist id="categorias">
                  {predefinedCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              
              {/* Categorías sugeridas */}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-gray-500 mr-2">Sugerencias:</span>
                {predefinedCategories.slice(0, 5).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({...form, categoria: cat})}
                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {(form.nombre || form.precio || form.cantidad) && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                  <Package className="w-5 h-5 text-purple-600" />
                  Vista Previa
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium">Producto:</span> {form.nombre || "Sin nombre"}</p>
                  <p><span className="font-medium">Stock:</span> {form.cantidad || "0"} unidades</p>
                  <p><span className="font-medium">Precio:</span> ${form.precio || "0.00"}</p>
                  <p><span className="font-medium">Categoría:</span> {form.categoria || "Sin categoría"}</p>
                  <p><span className="font-medium">Valor total:</span> 
                    <span className="text-green-600 font-bold ml-1">
                      ${((parseFloat(form.precio) || 0) * (parseInt(form.cantidad) || 0)).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando Producto...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Producto
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 text-white animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">💡 Consejos para Productos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="font-semibold mb-2">📝 Nombre Claro</div>
                <div className="opacity-90">Usa nombres descriptivos y específicos</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="font-semibold mb-2">🏷️ Categorización</div>
                <div className="opacity-90">Organiza por categorías para facilitar búsquedas</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="font-semibold mb-2">💰 Precios Justos</div>
                <div className="opacity-90">Considera costos y margen de ganancia</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ProductForm;