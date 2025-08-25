import { useState } from "react";
import ProductForm from "../Component/ProductoForm";


export default function Products() {
  const [reload, setReload] = useState(false);
  const refreshList = () => setReload(!reload);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Productos</h1>
      <ProductForm onProductAdded={refreshList} />      
    </div>
  );
}
