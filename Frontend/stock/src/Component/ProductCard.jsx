export default function ProductCard({ product }) {
  return (
    <div className="border p-4 rounded-2xl shadow-md bg-gray-50">
      <h3 className="text-lg font-bold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="font-semibold">💰 ${product.price}</p>
      <p className="text-sm">📦 Stock: {product.quantity}</p>
      <p className="text-sm text-gray-500">🏷 {product.category}</p>
    </div>
  );
}
