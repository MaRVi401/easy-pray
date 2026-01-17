import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQiblaDirection } from "../../api/kiblat";
import { ArrowLeft, Loader2, Navigation, RefreshCw, Info } from "lucide-react";

export default function Kiblat() {
  const [qiblaDir, setQiblaDir] = useState(0); // Derajat Kiblat dari lokasi
  const [compassHeading, setCompassHeading] = useState(0); // Posisi
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Ambil data arah kiblat berdasarkan koordinat lokasi
  const initKiblat = () => {
    setLoading(true);
    setError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const res = await getQiblaDirection(latitude, longitude);
          if (res) {
            setQiblaDir(res);
            setupCompass();
          } else {
            setError("Gagal mendapatkan data dari server.");
          }
          setLoading(false);
        },
        () => {
          setError("Akses lokasi ditolak. Fitur ini memerlukan GPS aktif.");
          setLoading(false);
        }
      );
    } else {
      setError("Browser Anda tidak mendukung fitur lokasi.");
      setLoading(false);
    }
  };

  // 2. Logika Kompas Real-time (Sensor Magnetometer)
  const setupCompass = () => {
    const handler = (e) => {
      // Mengambil heading (arah)
      const heading = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      setCompassHeading(heading);
    };

    if (window.DeviceOrientationEvent) {
      // Listener untuk iOS dan Android
      window.addEventListener("deviceorientation", handler, true);
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  };

  useEffect(() => {
    initKiblat();
  }, []);

  // Perhitungan rotasi akhir: Arah Kiblat dikurangi posisi saat ini
  const finalRotation = qiblaDir - compassHeading;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Loader2 className="animate-spin text-emerald-600 w-12 h-12 mb-4" />
      <p className="text-slate-400 font-black italic tracking-widest text-xs uppercase">Menghitung Titik Koordinat...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Sticky - Sama dengan menu lain */}
      <header className="bg-emerald-600 text-white p-5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90 group">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-2xl font-black tracking-tighter italic uppercase">
              <span className="text-white">Arah</span>
              <span className="text-emerald-950 ml-1">Kiblat</span>
            </h1>
          </div>
          <button onClick={initKiblat} className="p-2 hover:bg-white/20 rounded-full transition-all active:rotate-180 duration-500">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 sm:p-10 flex flex-col items-center">
        {error ? (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-100 text-center max-w-xs w-full mt-10">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Info className="text-red-500 w-8 h-8" />
            </div>
            <p className="text-slate-700 font-bold mb-6 leading-relaxed">{error}</p>
            <button onClick={initKiblat} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-100 uppercase tracking-widest text-xs">
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-1000">
            
            {/* Visualisasi Kompas */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 bg-white rounded-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border-[15px] border-emerald-50 flex items-center justify-center mb-12 mt-4 overflow-visible">
              
              {/* Petunjuk Arah Mata Angin Statis */}
              <span className="absolute top-4 font-black text-slate-200 text-sm tracking-tighter">NORTH</span>
              <span className="absolute bottom-4 font-black text-slate-200 text-sm tracking-tighter">SOUTH</span>

              <div 
                className="relative w-full h-full transition-transform duration-200 ease-linear"
                style={{ transform: `rotate(${finalRotation}deg)` }}
              >
                {/* Ikon Ka'bah Baru dari Flaticon */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 flex flex-col items-center group">
                  <div className="bg-slate-900 p-2.5 rounded-[1.2rem] shadow-2xl border-2 border-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/11105/11105004.png" 
                      alt="Ka'bah" 
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  </div>
                  <div className="w-1 h-20 bg-gradient-to-b from-emerald-500 via-emerald-200 to-transparent mt-1 shadow-sm"></div>
                </div>

                {/* Pointer Navigasi */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Navigation size={56} className="text-emerald-600 fill-current drop-shadow-2xl" />
                </div>
              </div>
            </div>

            {/* Info Box Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-1">Sudut Kiblat</span>
                 <p className="text-3xl font-black text-emerald-600 tracking-tighter">{Math.round(qiblaDir)}°</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-1">Orientasi</span>
                 <p className="text-3xl font-black text-slate-800 tracking-tighter">{Math.round(compassHeading)}°</p>
              </div>
            </div>

            {/* Hint Box */}
            <div className="mt-10 bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-start gap-4 max-w-sm">
               <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
                  <Info size={20} />
               </div>
               <p className="text-xs leading-relaxed text-emerald-900 font-medium">
                  Letakkan ponsel Anda di permukaan datar. Putar ponsel secara perlahan hingga <b>panah hijau</b> mengarah tepat ke ikon <b>Ka'bah</b> di atas.
               </p>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center opacity-20 mt-10">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-400">EasyPray • Qibla Finder</p>
      </footer>
    </div>
  );
}