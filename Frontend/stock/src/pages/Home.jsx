import { useState } from "react";
import ProductList from "../Component/ProductList";


const AddProduct = () => {
   const [reload, setReload] = useState(false);
  
    const refreshList = () => setReload(!reload);
  return (
    <div className="container mx-auto">
      <ProductList reload={reload} />
    </div>
  );
};

export default AddProduct;
