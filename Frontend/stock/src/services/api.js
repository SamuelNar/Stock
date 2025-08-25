const API_URL = "stock-8jpa4ovjd-lidercoms-projects.vercel.app/api"; // tu backend en Node.js

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/productos`);
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  return res.json();
};

// Ventas
export const registerSale = async (sale) => {
  const res = await fetch(`${API_URL}/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sale),
  });
  return res.json();
};

// Balance diario
export const getDailyBalance = async (fecha) => {
  const res = await fetch(`${API_URL}/ventas/balance/dia${fecha ? `?fecha=${fecha}` : ""}`);
  return res.json();
};

// Balance general
export const getGeneralBalance = async () => {
  const res = await fetch(`${API_URL}/ventas/balance/general`);
  return res.json();
};

