import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQiblaDirection } from "../../api/kiblat";
import { ArrowLeft, Loader2, Navigation, RefreshCw } from "lucide-react";

export default function Kiblat() {
  const [qiblaDir, setQiblaDir] = useState(0);
  const [compassHeading, setCompassHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            setupSensor();
          } else {
            setError("Gagal mendapatkan data arah.");
          }
          setLoading(false);
        },
        () => {
          setError("Izin lokasi ditolak. Aktifkan GPS.");
          setLoading(false);
        }
      );
    } else {
      setError("Browser tidak mendukung lokasi.");
      setLoading(false);
    }
  };

  const setupSensor = () => {
    const handler = (e) => {
      const heading = e.webkitCompassHeading || 360 - e.alpha;
      if (heading) setCompassHeading(heading);
    };

    window.addEventListener("deviceorientation", handler, true);
    window.addEventListener("deviceorientationabsolute", handler, true);
  };

  useEffect(() => {
    initKiblat();
  }, []);

  const totalRotation = qiblaDir - compassHeading;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 w-12 h-12 mb-4" />
      <p className="text-slate-400 font-bold italic">MENCARI KOORDINAT...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-emerald-600 text-white p-5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight uppercase italic">Arah Kiblat</h1>
          <button onClick={initKiblat} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 flex flex-col items-center">
        {error ? (
          <div className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100 text-center">
            <p className="text-red-600 font-bold mb-6">{error}</p>
            <button onClick={initKiblat} className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg">Coba Lagi</button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Compass UI */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-full shadow-2xl border-[12px] border-emerald-50 flex items-center justify-center mb-12 mt-6">
              <span className="absolute top-4 font-black text-slate-200">N</span>
              <span className="absolute bottom-4 font-black text-slate-200">S</span>
              
              <div 
                className="relative w-full h-full transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${totalRotation}deg)` }}
              >
                {/* Ikon Ka'bah */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 flex flex-col items-center">
                  <div className="bg-slate-900 p-2 rounded-xl shadow-xl border-2 border-emerald-400">
                    <img src="/icon/kabah-icon.png" alt="Ka'bah" className="w-8 h-8" 
                         onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/128/11105/11105004.png"} />
                  </div>
                  <div className="w-1 h-16 bg-gradient-to-b from-emerald-500 to-transparent mt-1"></div>
                </div>
                {/* Pointer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Navigation size={44} className="text-emerald-600 fill-current drop-shadow-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 w-full max-w-xs text-center">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Sudut Kiblat</span>
              <p className="text-4xl font-black text-emerald-600 tracking-tighter">{Math.round(qiblaDir)}°</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}