import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQiblaDirection } from "../../api/kiblat";
import { ArrowLeft, Loader2, Navigation, RefreshCw, Info, ShieldCheck } from "lucide-react";

export default function Kiblat() {
  const [qiblaDir, setQiblaDir] = useState(0); 
  const [compassHeading, setCompassHeading] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  // 1. Ambil data Qibla dari API
  const fetchQiblaData = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const res = await getQiblaDirection(latitude, longitude);
          if (res) setQiblaDir(res);
          setLoading(false);
        },
        () => {
          setError("Izin lokasi ditolak. Aktifkan GPS.");
          setLoading(false);
        }
      );
    }
  };

  // 2. Meminta Izin Sensor (Wajib untuk iOS dan Android modern)
  const startCompass = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      // Logic khusus iOS
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") {
          setHasPermission(true);
          activateSensor();
        }
      } catch (err) {
        setError("Izin sensor ditolak oleh sistem.");
      }
    } else {
      // Android atau Browser Desktop
      setHasPermission(true);
      activateSensor();
    }
  };

  // 3. Menjalankan Sensor Secara Real-time
  const activateSensor = () => {
    const handler = (e) => {
      // webkitCompassHeading untuk iOS, alpha untuk Android
      let heading = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      setCompassHeading(heading);
    };

    window.addEventListener("deviceorientation", handler, true);
    // Tambahan untuk Android agar lebih stabil
    window.addEventListener("deviceorientationabsolute", handler, true);
  };

  useEffect(() => {
    fetchQiblaData();
  }, []);

  // Rumus: (Derajat Kiblat dari North) - (Derajat HP saat ini dari North)
  const finalRotation = qiblaDir - compassHeading;

  // Cek apakah user sudah mengarah ke kiblat (toleransi 5 derajat)
  const isAligned = Math.abs(finalRotation % 360) < 5 || Math.abs(finalRotation % 360) > 355;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-emerald-600 w-12 h-12 mb-4" />
      <p className="text-slate-400 font-bold italic tracking-widest text-xs uppercase">Menghitung Posisi...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans transition-colors duration-500">
      <header className="bg-emerald-600 text-white p-5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90 group">
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <h1 className="text-lg md:text-2xl font-black tracking-tighter italic uppercase">
            Arah <span className="text-emerald-950">Kiblat</span>
          </h1>
          <button onClick={fetchQiblaData} className="p-2 hover:bg-white/20 rounded-full">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 sm:p-10 flex flex-col items-center">
        {error ? (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-100 text-center mt-10">
            <Info className="text-red-500 w-12 h-12 mx-auto mb-4" />
            <p className="text-slate-700 font-bold mb-6">{error}</p>
            <button onClick={fetchQiblaData} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black">Coba Lagi</button>
          </div>
        ) : !hasPermission ? (
          /* TAMPILAN IZIN SENSOR */
          <div className="flex flex-col items-center text-center mt-10 animate-in fade-in duration-700">
            <div className="bg-emerald-100 p-8 rounded-[3rem] mb-8">
              <Navigation size={64} className="text-emerald-600 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">Aktifkan Kompas</h2>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed max-w-xs">
              Klik tombol di bawah untuk menyelaraskan sensor perangkat Anda agar bisa mendeteksi arah kiblat secara presisi.
            </p>
            <button 
              onClick={startCompass} 
              className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black shadow-xl shadow-emerald-200 flex items-center gap-3 active:scale-95 transition-all"
            >
              <ShieldCheck /> MULAI NAVIGASI
            </button>
          </div>
        ) : (
          /* TAMPILAN KOMPAS REAL-TIME */
          <div className="flex flex-col items-center w-full animate-in zoom-in-95 duration-700">
            
            <div className={`mb-8 px-6 py-2 rounded-full border-2 transition-all duration-500 text-[10px] font-black uppercase tracking-widest ${isAligned ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-300'}`}>
               {isAligned ? '✨ TEPAT MENGARAH KIBLAT ✨' : 'Putar Perangkat Anda'}
            </div>

            <div className={`relative w-72 h-72 sm:w-96 sm:h-96 bg-white rounded-full transition-all duration-700 border-[15px] flex items-center justify-center mb-12 shadow-2xl ${isAligned ? 'border-emerald-500 shadow-emerald-100' : 'border-emerald-50'}`}>
              
              <div 
                className="relative w-full h-full transition-transform duration-150 ease-linear"
                style={{ transform: `rotate(${finalRotation}deg)` }}
              >
                {/* Ikon Ka'bah sebagai Target */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 flex flex-col items-center">
                  <div className={`p-3 rounded-2xl shadow-xl border-2 transition-all duration-500 ${isAligned ? 'bg-emerald-600 border-white scale-125' : 'bg-slate-900 border-emerald-400'}`}>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/11105/11105004.png" 
                      alt="Ka'bah" 
                      className="w-10 h-10 sm:w-14 sm:h-14"
                    />
                  </div>
                  <div className={`w-1 transition-all duration-500 ${isAligned ? 'h-24 bg-emerald-500' : 'h-16 bg-slate-200'}`}></div>
                </div>

                {/* Panah Navigasi */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Navigation size={64} className={`transition-all duration-500 ${isAligned ? 'text-emerald-500 fill-current' : 'text-slate-300'}`} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-start gap-4 max-w-sm">
               <div className={`p-3 rounded-2xl ${isAligned ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Info size={20} />
               </div>
               <p className="text-xs leading-relaxed text-slate-500 font-medium text-justify">
                  Pegang ponsel Anda secara horizontal (datar). Putar tubuh Anda secara perlahan sampai <b>ikon panah</b> bertemu dengan ikon <b>Ka'bah</b>.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}