import { useState, useEffect } from "react";
import { getProducts, registerSale } from "../services/api";
import { ShoppingCart, Trash2, Plus, Package, AlertCircle, CheckCircle, DollarSign } from "lucide-react";

const SaleForm = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [form, setForm] = useState({ producto_id: "", cantidad: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addProduct = () => {
    if (!form.producto_id || form.cantidad < 1) {
      alert("Selecciona un producto y cantidad válida");
      return;
    }

    const selectedProduct = products.find(p => p.id === parseInt(form.producto_id));
    if (!selectedProduct) return;

    // Verificar stock disponible
    const currentQuantityInCart = selectedProducts
      .filter(p => p.producto_id === form.producto_id)
      .reduce((sum, p) => sum + p.cantidad, 0);
    
    if (currentQuantityInCart + parseInt(form.cantidad) > selectedProduct.cantidad) {
      alert(`Stock insuficiente. Disponible: ${selectedProduct.cantidad}, En carrito: ${currentQuantityInCart}`);
      return;
    }

    const productoExistente = selectedProducts.find(p => p.producto_id === form.producto_id);
    if (productoExistente) {
      setSelectedProducts(selectedProducts.map(p =>
        p.producto_id === form.producto_id
          ? { ...p, cantidad: p.cantidad + parseInt(form.cantidad) }
          : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, {
        producto_id: form.producto_id,
        nombre: selectedProduct.nombre,
        precio: selectedProduct.precio,
        cantidad: parseInt(form.cantidad)
      }]);
    }

    setForm({ producto_id: "", cantidad: 1 });
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p.producto_id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeProduct(id);
      return;
    }

    const product = products.find(p => p.id === parseInt(id));
    if (newQuantity > product.cantidad) {
      alert(`Stock máximo disponible: ${product.cantidad}`);
      return;
    }

    setSelectedProducts(selectedProducts.map(p =>
      p.producto_id === id ? { ...p, cantidad: newQuantity } : p
    ));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }

    setSubmitting(true);
    try {
      const data = await registerSale({ productos: selectedProducts });
      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("🎉 Venta registrada con éxito");
        setSelectedProducts([]);
        // Recargar productos para actualizar stock
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error registering sale:", error);
      alert("Error al registrar la venta");
    } finally {
      setSubmitting(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: "text-red-500", bg: "bg-red-50", text: "Agotado" };
    if (stock <= 5) return { color: "text-yellow-600", bg: "bg-yellow-50", text: "Stock bajo" };
    return { color: "text-green-600", bg: "bg-green-50", text: "Disponible" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Punto de Venta
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Registra tus ventas de manera rápida y eficiente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Panel de selección de productos */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-xl">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Seleccionar Productos</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto
                </label>
                <select
                  name="producto_id"
                  value={form.producto_id}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/80"
                >
                  <option value="">🔍 Seleccionar producto</option>
                  {products.map(p => {
                    const status = getStockStatus(p.cantidad);
                    return (
                      <option 
                        key={p.id} 
                        value={p.id} 
                        disabled={p.cantidad === 0}
                        className={p.cantidad === 0 ? "text-gray-400" : ""}
                      >
                        {p.nombre} - ${p.precio.toFixed(2)} (Stock: {p.cantidad})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  min="1"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-4 focus:ring-green-100 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/80"
                />
              </div>

              <button
                type="button"
                onClick={addProduct}
                disabled={!form.producto_id}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Agregar al Carrito
              </button>
            </div>

            {/* Información del producto seleccionado */}
            {form.producto_id && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                {(() => {
                  const selectedProduct = products.find(p => p.id === parseInt(form.producto_id));
                  const status = getStockStatus(selectedProduct?.cantidad || 0);
                  return selectedProduct ? (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{selectedProduct.nombre}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>💰 Precio: <span className="font-semibold">${selectedProduct.precio.toFixed(2)}</span></p>
                        <p className={`flex items-center gap-1 ${status.color}`}>
                          📦 Stock: <span className="font-semibold">{selectedProduct.cantidad}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                            {status.text}
                          </span>
                        </p>
                        {selectedProduct.descripcion && (
                          <p className="text-gray-500">📝 {selectedProduct.descripcion}</p>
                        )}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>

          {/* Carrito de compras */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Carrito</h2>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">Carrito vacío</p>
                <p className="text-gray-400 text-sm">Agrega productos para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedProducts.map(item => (
                  <div key={item.producto_id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.nombre}</h4>
                        <p className="text-sm text-gray-600">
                          ${item.precio.toFixed(2)} × {item.cantidad} = 
                          <span className="font-semibold text-green-600 ml-1">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.producto_id, item.cantidad - 1)}
                            className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-2 bg-white min-w-[50px] text-center">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
                            className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeProduct(item.producto_id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold text-gray-700">Total:</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Registrar Venta
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {selectedProducts.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 text-white animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">📊 Resumen de Venta</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">Productos</div>
                  <div className="text-2xl font-bold">{selectedProducts.length}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">Unidades</div>
                  <div className="text-2xl font-bold">
                    {selectedProducts.reduce((sum, item) => sum + item.cantidad, 0)}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">Promedio/Unidad</div>
                  <div className="text-2xl font-bold">
                    ${selectedProducts.length > 0 ? 
                      (calculateTotal() / selectedProducts.reduce((sum, item) => sum + item.cantidad, 0)).toFixed(2) : 
                      "0.00"
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default SaleForm;