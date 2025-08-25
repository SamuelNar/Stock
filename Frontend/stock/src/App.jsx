import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import SaleForm from "./Component/SaleForm";
import Balance from "./Component/Balance";

function App() {
  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/add">Agregar Producto</Link>
        <Link to="/venta">Venta</Link>
        <Link to="/balance">Balance</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/venta" element={<SaleForm />} />
        <Route path="/balance" element={<Balance/>} />
      </Routes>
    </>
  );
}

export default App;
