import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getQiblaDirection } from "../../api/kiblat";
import { ArrowLeft, Loader2, Navigation, RefreshCw, Info, Compass, ShieldCheck } from "lucide-react";

export default function Kiblat() {
  const [qiblaDir, setQiblaDir] = useState(0);
  const [compassHeading, setCompassHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAligned, setIsAligned] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // 1. Fungsi Getaran (Haptic Feedback)
  const triggerVibration = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50); // Getar singkat 50ms
    }
  }, []);

  // 2. Request Permission (Khusus iOS 13+)
  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          setPermissionGranted(true);
          initKiblat();
        } else {
          setError("Izin sensor ditolak. Fitur kompas tidak dapat berjalan.");
        }
      } catch (err) {
        setError("Gagal meminta izin sensor.");
      }
    } else {
      // Android atau Browser Desktop
      setPermissionGranted(true);
      initKiblat();
    }
  };

  const initKiblat = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const res = await getQiblaDirection(latitude, longitude);
          if (res) {
            setQiblaDir(res);
            setupCompass();
          }
          setLoading(false);
        },
        () => {
          setError("Aktifkan GPS untuk akurasi arah kiblat.");
          setLoading(false);
        }
      );
    }
  };

  const setupCompass = () => {
    const handler = (e) => {
      let heading = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : 0);
      setCompassHeading(heading);
    };

    window.addEventListener("deviceorientation", handler, true);
    window.addEventListener("deviceorientationabsolute", handler, true);
  };

  useEffect(() => {
    // Cek apakah sudah sejajar (toleransi 3 derajat)
    const diff = Math.abs((qiblaDir - compassHeading + 360) % 360);
    const aligned = diff < 3 || diff > 357;
    
    if (aligned && !isAligned) {
      triggerVibration();
    }
    setIsAligned(aligned);
  }, [compassHeading, qiblaDir, isAligned, triggerVibration]);

  const finalRotation = qiblaDir - compassHeading;

  if (!permissionGranted && !loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
        <Compass size={40} className="animate-pulse" />
      </div>
      <h2 className="text-xl font-black text-slate-800 mb-2">Akses Sensor Kompas</h2>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">EasyPray memerlukan akses ke sensor orientasi perangkat Anda untuk menunjukkan arah kiblat secara realtime.</p>
      <button onClick={requestPermission} className="w-full max-w-xs bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95 transition-all">
        <ShieldCheck size={18} /> Mulai Kompas
      </button>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="relative">
        <Loader2 className="animate-spin text-emerald-600 w-16 h-16 mb-4" />
        <Navigation className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-200 w-6 h-6" />
      </div>
      <p className="text-slate-400 font-black italic tracking-widest text-[10px] uppercase">Menyelaraskan Koordinat...</p>
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
            <span className="text-white">Arah</span>
            <span className="text-emerald-950 ml-1">Kiblat</span>
          </h1>
          <button onClick={initKiblat} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 sm:p-10 flex flex-col items-center">
        {error ? (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-red-100 text-center max-w-xs w-full mt-10">
            <Info className="text-red-500 w-12 h-12 mx-auto mb-4" />
            <p className="text-slate-700 font-bold mb-6 text-sm">{error}</p>
            <button onClick={initKiblat} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg">Coba Lagi</button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            
            {/* Status Indicator */}
            <div className={`mb-8 px-6 py-2 rounded-full border-2 transition-all duration-500 font-black text-[10px] tracking-[0.3em] uppercase ${isAligned ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-200' : 'bg-white border-slate-100 text-slate-300'}`}>
              {isAligned ? 'Sangat Presisi (Sejajar)' : 'Putar Perangkat Anda'}
            </div>

            {/* Visualisasi Kompas */}
            <div className={`relative w-72 h-72 sm:w-96 sm:h-96 bg-white rounded-full transition-all duration-700 border-[15px] flex items-center justify-center mb-12 overflow-visible ${isAligned ? 'shadow-[0_0_80px_rgba(16,185,129,0.3)] border-emerald-100' : 'shadow-xl border-emerald-50'}`}>
              
              {/* Dial Kompas (Derajat) */}
              <div className="absolute inset-0 rounded-full opacity-10" style={{ backgroundImage: `repeating-conic-gradient(from 0deg, #000 0deg 1deg, transparent 1deg 30deg)` }}></div>
              <span className="absolute top-6 font-black text-slate-300 text-xs">NORTH</span>

              <div 
                className="relative w-full h-full transition-transform duration-300 ease-out"
                style={{ transform: `rotate(${finalRotation}deg)` }}
              >
                {/* Ikon Ka'bah dengan Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 flex flex-col items-center">
                  <div className={`p-3 rounded-[1.5rem] shadow-2xl border-2 transition-all duration-500 ${isAligned ? 'bg-emerald-600 border-white scale-125' : 'bg-slate-900 border-emerald-400'}`}>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/11105/11105004.png" 
                      alt="Ka'bah" 
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />
                  </div>
                  <div className={`w-1 transition-all duration-500 mt-1 ${isAligned ? 'h-24 bg-emerald-500' : 'h-20 bg-emerald-200'}`}></div>
                </div>

                {/* Pointer Navigasi */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Navigation size={60} className={`transition-all duration-500 ${isAligned ? 'text-emerald-500 fill-current scale-110' : 'text-slate-300'}`} />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 text-center group hover:border-emerald-200 transition-colors">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Sudut Ka'bah</span>
                 <p className="text-3xl font-black text-emerald-600 tabular-nums">{Math.round(qiblaDir)}°</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 text-center group hover:border-emerald-200 transition-colors">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Heading</span>
                 <p className="text-3xl font-black text-slate-800 tabular-nums">{Math.round(compassHeading)}°</p>
              </div>
            </div>

            {/* Instruction Box */}
            <div className="mt-10 bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-start gap-4 max-w-sm shadow-sm">
               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${isAligned ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Info size={20} />
               </div>
               <p className="text-[11px] leading-relaxed text-slate-500 font-medium text-justify">
                  Letakkan ponsel Anda di permukaan datar. Putar ponsel secara perlahan hingga <b>panah</b> mengarah tepat ke ikon <b>Ka'bah</b>. Getaran akan terasa saat posisi sudah presisi.
               </p>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-10">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-300 italic">EasyPray • Qibla Precision</p>
      </footer>
    </div>
  );
}