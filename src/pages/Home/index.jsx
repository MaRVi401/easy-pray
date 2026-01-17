import { BookOpen, BookText, Sparkles, Clock, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const menus = [
  { 
    title: "Al-Qur'an", 
    desc: "Baca dan dengarkan murottal", 
    icon: <BookOpen className="w-7 h-7" />, 
    path: "/quran", 
    color: "bg-blue-500" 
  },
  { 
    title: "Jadwal Sholat", 
    desc: "Waktu sholat sesuai lokasi", 
    icon: <Clock className="w-7 h-7" />, 
    path: "/sholat", 
    color: "bg-emerald-500" 
  },
  { 
    title: "Hadits", 
    desc: "Cari ribuan hadits shahih", 
    icon: <BookText className="w-7 h-7" />, 
    path: "/hadits", 
    color: "bg-amber-500" 
  },
  { 
    title: "Doa Harian", 
    desc: "Kumpulan doa sehari-hari", 
    icon: <Sparkles className="w-7 h-7" />, 
    path: "/doa", 
    color: "bg-rose-500" 
  },
  { 
    title: "Arah Kiblat", 
    desc: "Cari arah ka'bah presisi", 
    icon: <Navigation className="w-7 h-7 rotate-45" />, 
    path: "/kiblat", 
    color: "bg-indigo-500" 
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Section */}
      <header className="bg-emerald-600 text-white pt-12 pb-28 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* CONTAINER LOGO */}
          <div className="mb-6 flex justify-center">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-[2rem] border border-white/30 shadow-2xl transition-transform hover:scale-110 duration-500">
              <img
                src="/icon/icon1.svg"
                alt="Logo EasyPray"
                className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
              />
            </div>
          </div>

          {/* TITLE BRANDING */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none">
            <span className="bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent pr-2">
              Easy
            </span>
            <span className="text-emerald-950">
              Pray
            </span>
          </h1>

          <p className="mt-4 text-emerald-50 italic font-bold tracking-widest text-xs md:text-sm uppercase opacity-80">
            "Mempermudah Ibadahmu di Mana Saja"
          </p>

          {/* WELCOME BOX */}
          <div className="mt-10 bg-white/10 backdrop-blur-lg rounded-[2rem] p-6 text-left border border-white/20 shadow-inner max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">Ahlan wa sahlan!</p>
            </div>
            <h2 className="text-xl md:text-2xl font-black leading-tight">Sudahkah Anda Beribadah Hari Ini?</h2>
          </div>
        </div>
      </header>

      {/* Menu Grid Container */}
      <main className="max-w-5xl mx-auto -mt-16 px-4 pb-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {menus.map((menu, index) => (
            <Link
              key={index}
              to={menu.path}
              className="flex items-center p-5 sm:p-7 bg-white rounded-[2rem] shadow-sm border border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
            >
              <div className={`${menu.color} w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-3xl text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500`}>
                {menu.icon}
              </div>
              <div className="ml-5 sm:ml-7 min-w-0">
                <h3 className="font-black text-slate-800 text-lg sm:text-xl leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                  {menu.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 italic line-clamp-1">
                  {menu.desc}
                </p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                 <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Navigation className="w-4 h-4" />
                 </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Card Tambahan */}
        <div className="mt-10 p-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
                <h4 className="text-lg font-black uppercase tracking-widest mb-2">EasyPray v1.0</h4>
                <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
                    Aplikasi pendamping ibadah muslim modern yang ringan, cepat, dan tanpa iklan. Nikmati kemudahan dalam satu genggaman.
                </p>
            </div>
            <BookOpen className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
        </div>
      </main>

      <footer className="text-center pb-12">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          EasyPray • Powered by YSS
        </p>
      </footer>
    </div>
  );
}