import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import SaleForm from "./Component/SaleForm";
import Balance from "./Component/Balance";
import { useEffect, useState } from "react";
import Login from "./Component/Login";
import { supabase } from "../supabase.js";
import { logoutUser } from "./services/api";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Revisar si ya hay sesión
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    loadSession();

    // Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <Login onLogin={setUser} />
      ) : (
        <>
          <nav className="bg-gray-800 text-white p-4 flex gap-4 justify-between">
            <div className="flex gap-4">
              <Link to="/">Inicio</Link>
              <Link to="/add">Agregar Producto</Link>
              <Link to="/venta">Venta</Link>
              <Link to="/balance">Balance</Link>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/venta" element={<SaleForm />} />
            <Route path="/balance" element={<Balance />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;