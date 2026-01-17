import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getQiblaDirection } from "../../api/kiblat";
import { ArrowLeft, Loader2, RefreshCw, Info, ShieldCheck, Compass, MoveUp, Map, Globe, Landmark } from "lucide-react";

export default function Kiblat() {
  const [qiblaDir, setQiblaDir] = useState(0);
  const [compassHeading, setCompassHeading] = useState(0);
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Fungsi hitung jarak Haversine (KM)
  const calculateDistance = (lat1, lon1) => {
    const lat2 = 21.4225; // Latitude Ka'bah
    const lon2 = 39.8262; // Longitude Ka'bah
    const R = 6371; // Radius Bumi dalam KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const fetchQiblaData = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          setDistance(calculateDistance(latitude, longitude));
          
          const res = await getQiblaDirection(latitude, longitude);
          if (res) setQiblaDir(res);
          setLoading(false);
        },
        () => {
          setError("Gagal mengakses lokasi. Pastikan GPS aktif.");
          setLoading(false);
        }
      );
    }
  };

  const startCompass = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          setHasPermission(true);
          activateSensor();
        }
      } catch (err) {
        setError("Izin sensor ditolak.");
      }
    } else {
      setHasPermission(true);
      activateSensor();
    }
  };

  const activateSensor = () => {
    const handler = (e) => {
      let heading = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      setCompassHeading(heading);
    };
    window.addEventListener("deviceorientation", handler, true);
    window.addEventListener("deviceorientationabsolute", handler, true);
  };

  useEffect(() => {
    fetchQiblaData();
  }, []);

  const finalRotation = qiblaDir - compassHeading;
  const relativeTurn = (qiblaDir - compassHeading + 360) % 360;
  const isAligned = Math.abs((finalRotation + 360) % 360) < 3 || Math.abs((finalRotation + 360) % 360) > 357;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Loader2 className="animate-spin text-emerald-600 w-12 h-12 mb-4" />
      <p className="text-slate-400 font-black italic tracking-widest text-[10px] uppercase">Menghitung Jarak Ke Mekkah...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-emerald-600 text-white p-5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg md:text-2xl font-black tracking-tighter italic uppercase">Informasi <span className="text-emerald-950">Kiblat</span></h1>
          <button onClick={fetchQiblaData} className="p-2 hover:bg-white/20 rounded-full"><RefreshCw className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-10 flex flex-col items-center">
        {!hasPermission ? (
          <div className="flex flex-col items-center text-center mt-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-emerald-100">
              <Compass size={48} className="animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Aktifkan Navigasi</h2>
            <button onClick={startCompass} className="bg-emerald-600 text-white px-12 py-5 rounded-[2rem] font-black shadow-xl uppercase tracking-widest text-xs">Mulai Kompas</button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-1000">
            
            {/* Status & Visualisasi Kompas */}
            <div className={`mb-6 px-8 py-2.5 rounded-full border-2 transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] ${isAligned ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white border-slate-100 text-slate-300'}`}>
               {isAligned ? '✨ SEJAJAR DENGAN KA\'BAH ✨' : `Putar ${Math.round(relativeTurn)}° ke Kanan`}
            </div>

            <div className={`relative w-72 h-72 sm:w-96 sm:h-96 bg-white rounded-full transition-all duration-700 border-[15px] flex items-center justify-center mb-10 shadow-2xl ${isAligned ? 'border-emerald-500' : 'border-emerald-50'}`}>
              <div className="relative w-full h-full transition-transform duration-200 ease-linear" style={{ transform: `rotate(${finalRotation}deg)` }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 flex flex-col items-center">
                  <div className={`p-3 rounded-[1.5rem] shadow-2xl border-2 transition-all duration-500 ${isAligned ? 'bg-emerald-600 border-white scale-125' : 'bg-slate-900 border-emerald-400'}`}>
                    <img src="https://cdn-icons-png.flaticon.com/128/11105/11105004.png" alt="Ka'bah" className="w-10 h-10 sm:w-14 sm:h-14" />
                  </div>
                  <div className={`w-1 transition-all duration-500 mt-1 ${isAligned ? 'h-24 bg-emerald-500' : 'h-16 bg-slate-200'}`}></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <MoveUp size={64} strokeWidth={3} className={`${isAligned ? 'text-emerald-500 scale-110' : 'text-slate-200'} transition-all`} />
                </div>
              </div>
            </div>

            {/* Grid Informasi Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Card Jarak */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Landmark size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Jarak ke Ka'bah</span>
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{distance.toLocaleString()} <span className="text-sm text-slate-400">KM</span></p>
                </div>
              </div>

              {/* Card Derajat */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Compass size={28} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Sudut Presisi</span>
                  <p className="text-2xl font-black text-emerald-600 tracking-tighter">{Math.round(qiblaDir)}° <span className="text-sm text-slate-400">N</span></p>
                </div>
              </div>

              {/* Card Koordinat */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 md:col-span-2">
                <div className="w-14 h-14 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center shadow-inner">
                  <Globe size={28} />
                </div>
                <div className="grid grid-cols-2 gap-8 flex-1">
                  <div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Latitude</span>
                    <p className="text-sm font-bold text-slate-600">{coords.lat.toFixed(5)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Longitude</span>
                    <p className="text-sm font-bold text-slate-600">{coords.lng.toFixed(5)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-start gap-4 w-full shadow-sm">
               <Info className="text-emerald-600 w-6 h-6 flex-shrink-0" />
               <p className="text-[11px] leading-relaxed text-slate-500 font-medium text-justify">
                  Perhitungan jarak menggunakan formula <b>Haversine</b> (titik koordinat bumi). Sudut kiblat dihitung berdasarkan arah Utara Geografis. Pastikan tidak ada gangguan magnet di sekitar perangkat.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}