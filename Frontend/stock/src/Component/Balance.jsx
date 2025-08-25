import { useState, useEffect } from "react";
import { getDailyBalance, getGeneralBalance } from "../services/api";
import { Calendar, BarChart2, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const Balance = () => {
  const [fecha, setFecha] = useState("");
  const [daily, setDaily] = useState(null);
  const [general, setGeneral] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dailyLoading, setDailyLoading] = useState(false);

  useEffect(() => {
    const fetchGeneral = async () => {
      setLoading(true);
      try {
        const data = await getGeneralBalance();
        setGeneral(data);
      } catch (error) {
        console.error("Error fetching general balance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGeneral();
  }, []);

  const handleDaily = async () => {
    if (!fecha) {
      alert("Selecciona una fecha");
      return;
    }
    
    setDailyLoading(true);
    try {
      const data = await getDailyBalance(fecha);
      setDaily(data);
    } catch (error) {
      console.error("Error fetching daily balance:", error);
      alert("Error al obtener el balance diario");
    } finally {
      setDailyLoading(false);
    }
  };

  const formatCurrency = (num) => `$${num?.toFixed(2) || "0.00"}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Dashboard Financiero
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Monitorea tus ingresos y gastos en tiempo real</p>
        </div>

        {/* Balance Diario */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 animate-slide-up">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Balance Diario
            </h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona una fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div className="lg:mt-7">
                <button
                  onClick={handleDaily}
                  disabled={dailyLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {dailyLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <BarChart2 className="w-5 h-5" />
                  )}
                  {dailyLoading ? "Cargando..." : "Consultar"}
                </button>
              </div>
            </div>
            {fecha && (
              <div className="mt-3 text-sm text-blue-700 font-medium">
                📅 {formatDate(fecha)}
              </div>
            )}
          </div>

          {daily && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-green-700 mb-1">Ingresos del Día</div>
                <div className="text-3xl font-bold text-green-800">{formatCurrency(daily.ingresos)}</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-red-700 mb-1">Gastos del Día</div>
                <div className="text-3xl font-bold text-red-800">{formatCurrency(daily.gastos)}</div>
              </div>
              
              <div className={`rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                daily.balance >= 0
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                  : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
              }`}>
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-2 rounded-full ${
                    daily.balance >= 0 ? "bg-blue-100" : "bg-orange-100"
                  }`}>
                    <DollarSign className={`w-6 h-6 ${
                      daily.balance >= 0 ? "text-blue-600" : "text-orange-600"
                    }`} />
                  </div>
                </div>
                <div className={`text-sm font-medium mb-1 ${
                  daily.balance >= 0 ? "text-blue-700" : "text-orange-700"
                }`}>
                  Balance del Día
                </div>
                <div className={`text-3xl font-bold ${
                  daily.balance >= 0 ? "text-blue-800" : "text-orange-800"
                }`}>
                  {formatCurrency(daily.balance)}
                </div>
                <div className={`text-xs mt-2 font-medium ${
                  daily.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {daily.balance >= 0 ? "✓ Positivo" : "⚠ Negativo"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Balance General */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-purple-100 rounded-xl">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              Balance General
            </h2>
            <div className="ml-auto">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Total acumulado
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando balance general...</p>
              </div>
            </div>
          ) : general ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-green-700 mb-1">Ingresos Totales</div>
                <div className="text-3xl font-bold text-green-800">{formatCurrency(general.ingresos)}</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-red-100 rounded-full">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="text-sm font-medium text-red-700 mb-1">Gastos Totales</div>
                <div className="text-3xl font-bold text-red-800">{formatCurrency(general.gastos)}</div>
              </div>
              
              <div className={`rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                general.balance >= 0
                  ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                  : "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
              }`}>
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-2 rounded-full ${
                    general.balance >= 0 ? "bg-blue-100" : "bg-orange-100"
                  }`}>
                    <DollarSign className={`w-6 h-6 ${
                      general.balance >= 0 ? "text-blue-600" : "text-orange-600"
                    }`} />
                  </div>
                </div>
                <div className={`text-sm font-medium mb-1 ${
                  general.balance >= 0 ? "text-blue-700" : "text-orange-700"
                }`}>
                  Balance Total
                </div>
                <div className={`text-3xl font-bold ${
                  general.balance >= 0 ? "text-blue-800" : "text-orange-800"
                }`}>
                  {formatCurrency(general.balance)}
                </div>
                <div className={`text-xs mt-2 font-medium ${
                  general.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {general.balance >= 0 ? "✓ Saludable" : "⚠ Déficit"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <BarChart2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>

        {/* Resumen rápido */}
        {general && (
          <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 text-white animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">📊 Resumen Financiero</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">Ratio Ingresos/Gastos</div>
                  <div className="text-2xl font-bold">
                    {general.gastos > 0 ? (general.ingresos / general.gastos).toFixed(2) : "∞"}
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">Margen de Ganancia</div>
                  <div className="text-2xl font-bold">
                    {general.ingresos > 0 ? ((general.balance / general.ingresos) * 100).toFixed(1) : "0"}%
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

export default Balance;