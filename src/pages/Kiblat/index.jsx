import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQiblaDirection } from "../../api/kiblat";
import { ArrowLeft, Loader2, Navigation, RefreshCw, AlertCircle } from "lucide-react";

export default function Kiblat() {
  const [qiblaDir, setQiblaDir] = useState(0); // Derajat Kiblat dari API
  const [compassHeading, setCompassHeading] = useState(0); // Derajat HP saat ini
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  // 1. Ambil Data Kiblat dari API berdasarkan Lokasi
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
            startCompass();
          } else {
            setError("Gagal mengambil data arah kiblat.");
          }
          setLoading(false);
        },
        () => {
          setError("Izin lokasi ditolak. Aktifkan GPS untuk mendeteksi arah.");
          setLoading(false);
        }
      );
    }
  };

  // 2. Logika Kompas Real-time
  const startCompass = () => {
    const handler = (e) => {
      let heading = 0;
      if (e.webkitCompassHeading) {
        // Khusus iOS
        heading = e.webkitCompassHeading;
        setIsIOS(true);
      } else if (e.alpha !== null) {
        // Android (Gunakan deviceorientationabsolute jika tersedia di browser)
        heading = 360 - e.alpha;
      }
      setCompassHeading(heading);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handler, true);
      // Untuk Android Chrome versi baru
      window.addEventListener("deviceorientationabsolute", handler, true);
    } else {
      setError("Sensor kompas tidak didukung di perangkat ini.");
    }
  };

  // 3. Request Permission khusus iOS
  const requestIOSPermission = () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            initKiblat();
          }
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    initKiblat();
  }, []);

  // Hitung rotasi jarum: (Arah Kiblat - Heading HP)
  const totalRotation = qiblaDir - compassHeading;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      <header className="bg-emerald-600 text-white p-5 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight uppercase">Arah Kiblat</h1>
          <button onClick={initKiblat} className="p-2 hover:bg-white/20 rounded-full transition-all">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 flex flex-col items-center">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="animate-spin text-emerald-600 w-12 h-12 mx-auto mb-4" />
            <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Menghitung Arah...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center px-6">
            <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 mb-6">
               <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
               <p className="text-red-600 font-bold leading-relaxed">{error}</p>
            </div>
            {/* Tombol khusus iOS untuk mengaktifkan sensor */}
            <button 
              onClick={requestIOSPermission}
              className="bg-emerald-600 text-white px-8 py-4 rounded-full font-black shadow-lg uppercase tracking-widest text-sm"
            >
              Aktifkan Kompas
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col items-center">
            
            {/* Visualisasi Kompas */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-emerald-50 flex items-center justify-center mb-12 mt-10">
              
              {/* Mata Angin Statis */}
              <div className="absolute inset-4 border border-slate-100 rounded-full"></div>
              <span className="absolute top-2 font-black text-slate-300 text-sm">N</span>
              <span className="absolute bottom-2 font-black text-slate-300 text-sm">S</span>
              <span className="absolute left-2 font-black text-slate-300 text-sm">W</span>
              <span className="absolute right-2 font-black text-slate-300 text-sm">E</span>

              {/* Jarum Arah Kiblat & Ikon Ka'bah */}
              <div 
                className="relative w-full h-full transition-transform duration-200 ease-linear"
                style={{ transform: `rotate(${totalRotation}deg)` }}
              >
                {/* Ikon Ka'bah di bagian atas jarum */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 flex flex-col items-center">
                  <div className="bg-slate-900 p-2 rounded-xl shadow-xl border-2 border-emerald-400">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="6" width="16" height="13" rx="1" fill="#0f172a"/>
                      <path d="M4 10H20" stroke="#f59e0b" strokeWidth="2"/>
                      <rect x="10" y="13" width="4" height="6" fill="#f59e0b"/>
                    </svg>
                  </div>
                  <div className="w-1 h-20 bg-gradient-to-b from-emerald-500 to-transparent mt-1"></div>
                </div>

                {/* Panah Navigasi */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Navigation size={40} className="text-emerald-600 fill-current drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kiblat</span>
                 <p className="text-2xl font-black text-emerald-600">{Math.round(qiblaDir)}°</p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 text-center">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posisi Anda</span>
                 <p className="text-2xl font-black text-slate-800">{Math.round(compassHeading)}°</p>
              </div>
            </div>

            <div className="mt-8 bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-start gap-4">
               <Info className="w-6 h-6 text-emerald-600 flex-shrink-0" />
               <p className="text-xs leading-relaxed text-emerald-900 font-medium">
                  Letakkan ponsel di permukaan datar dan jauhkan dari benda logam atau magnet. Putar ponsel hingga panah mengarah tepat ke ikon <b>Ka'bah</b>.
               </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}