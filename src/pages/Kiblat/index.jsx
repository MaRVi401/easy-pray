import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQiblaDirection } from "../../api/kiblat";
import { ArrowLeft, Compass, Loader2, Navigation, RefreshCw } from "lucide-react";

export default function Kiblat() {
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKiblat = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const deg = await getQiblaDirection(latitude, longitude);
          if (deg) {
            setDirection(deg);
          } else {
            setError("Gagal memuat data API.");
          }
          setLoading(false);
        },
        () => {
          setError("Izin lokasi ditolak. Aktifkan GPS untuk fitur ini.");
          setLoading(false);
        }
      );
    } else {
      setError("Browser Anda tidak mendukung lokasi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKiblat();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Header Emerald */}
      <header className="bg-emerald-600 text-white p-5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight uppercase">Arah Kiblat</h1>
          <button onClick={fetchKiblat} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 flex flex-col items-center">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="animate-spin text-emerald-600 w-12 h-12 mx-auto mb-4" />
            <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Mencari Koordinat...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center px-10">
            <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 mb-6">
               <p className="text-red-500 font-bold">{error}</p>
            </div>
            <button onClick={fetchKiblat} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in duration-700">
            {/* Visualisasi Kompas */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full shadow-2xl border-8 border-emerald-50 flex items-center justify-center mb-10 overflow-hidden mt-10">
               {/* Label Arah Mata Angin */}
               <span className="absolute top-4 font-black text-slate-300">N</span>
               <span className="absolute bottom-4 font-black text-slate-300">S</span>
               <span className="absolute left-4 font-black text-slate-300">W</span>
               <span className="absolute right-4 font-black text-slate-300">E</span>

               {/* Jarum Kompas (Statis sebagai background) */}
               <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <Compass size={200} />
               </div>

               {/* Jarum Arah Kiblat (Berputar sesuai Derajat) */}
               <div 
                 className="relative z-10 transition-transform duration-1000 ease-out"
                 style={{ transform: `rotate(${direction}deg)` }}
               >
                  <Navigation size={60} className="text-emerald-600 fill-current drop-shadow-lg" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    KA'BAH
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 w-full text-center">
               <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Derajat dari Utara</h2>
               <p className="text-4xl font-black text-emerald-600 tracking-tighter">{Math.round(direction)}°</p>
            </div>

            <div className="mt-8 flex items-start gap-4 text-slate-400 bg-slate-100/50 p-6 rounded-3xl border border-dashed border-slate-200">
               <Compass size={24} className="flex-shrink-0" />
               <p className="text-xs leading-relaxed font-medium">
                  Letakkan ponsel Anda di permukaan yang datar. Gunakan sensor kompas fisik ponsel Anda untuk menentukan arah Utara, lalu ikuti arah panah hijau di atas.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}