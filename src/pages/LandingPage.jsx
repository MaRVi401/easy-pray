import { BookOpen, BookText, Heart, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const menus = [
  { title: "Al-Qur'an", desc: "Baca dan dengarkan murottal", icon: <BookOpen className="w-8 h-8" />, path: "/quran", color: "bg-blue-500" },
  { title: "Jadwal Sholat", desc: "Waktu sholat berdasarkan lokasi", icon: <Clock className="w-8 h-8" />, path: "/jadwal", color: "bg-emerald-500" },
  { title: "Hadits", desc: "Cari ribuan hadits shahih", icon: <BookText className="w-8 h-8" />, path: "/hadits", color: "bg-amber-500" },
  { title: "Doa Harian", desc: "Kumpulan doa sehari-hari", icon: <Heart className="w-8 h-8" />, path: "/doa", color: "bg-rose-500" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Hero Section */}
      <header className="bg-emerald-600 text-white pt-16 pb-24 px-6 rounded-b-[3rem] shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">EasyPray</h1>
          <p className="mt-2 text-emerald-100 italic">"Mempermudah Ibadahmu di Mana Saja"</p>
          <div className="mt-8 bg-white/20 backdrop-blur-md rounded-2xl p-6 text-left border border-white/30">
            <p className="text-sm">Ahlan wa sahlan!</p>
            <h2 className="text-xl font-semibold">Sudahkah Anda Berdoa Hari Ini?</h2>
          </div>
        </div>
      </header>

      {/* Menu Grid */}
      <main className="max-w-4xl mx-auto -mt-12 px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menus.map((menu, index) => (
            <Link 
              key={index} 
              to={menu.path}
              className="flex items-center p-5 bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all active:scale-95 group"
            >
              <div className={`${menu.color} p-4 rounded-xl text-white mr-4 group-hover:rotate-6 transition-transform`}>
                {menu.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{menu.title}</h3>
                <p className="text-sm text-gray-500">{menu.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="text-center text-gray-400 text-xs mt-4 pb-8">
        EasyPray v1.0 • Powered by YSS
      </footer>
    </div>
  );
}