import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHadithBooks } from "../../api/hadith"; //
import { ArrowLeft, BookText, Loader2, ChevronRight, Search } from "lucide-react";

export default function Hadith() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  // Definisi pengelompokan perawi
  const categories = {
    "Sahihain": ["bukhari", "muslim"],
    "Kutubus Sittah": ["bukhari", "muslim", "abu-daud", "tirmidzi", "nasai", "ibnu-majah"],
    "Sunan": ["abu-daud", "tirmidzi", "nasai", "ibnu-majah", "darimi"],
    "Musnad & Muwatta": ["ahmad", "malik"]
  };

  useEffect(() => {
    getHadithBooks().then((data) => {
      setBooks(data || []);
      setLoading(false);
    });
  }, []);

  const filteredBooks = books.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    if (activeCategory === "Semua") return matchSearch;
    return matchSearch && categories[activeCategory].includes(b.id);
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans">
      {/* Header Responsif */}
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-lg px-3 py-3 sm:px-6 sm:py-4">
        <div className="max-w-5xl mx-auto">
          {/* Baris Atas: Tombol Kembali & Branding Easy Pray */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Link to="/" className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all active:scale-90 group">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/icon/icon1.svg" alt="Logo" className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-sm" />
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tighter italic select-none">
                <span className="bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent pr-1">Easy</span>
                <span className="text-emerald-950">Pray</span>
              </h1>
            </div>
            
            {/* Spacer untuk menjaga logo tetap di tengah */}
            <div className="w-8 sm:w-10"></div> 
          </div>

          {/* Baris Tengah: Search Input Responsif */}
          <div className="relative group mb-4 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Cari nama perawi (Bukhari, Muslim, dsb)..."
              className="w-full p-2.5 sm:p-3.5 pl-10 sm:pl-12 rounded-xl sm:rounded-2xl text-xs sm:text-base text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 bg-white shadow-inner transition-all placeholder:text-gray-400 font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Baris Bawah: Kategori Responsif (Scroll di Mobile, Center di Desktop) */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:justify-center items-center">
            {["Semua", "Sahihain", "Kutubus Sittah", "Sunan", "Musnad & Muwatta"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === cat 
                  ? "bg-white text-emerald-700 shadow-md scale-105" 
                  : "bg-emerald-700/50 text-emerald-100 hover:bg-emerald-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Grid Responsif (1 Kolom Mobile, 2 Tablet, 3 Desktop) */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin w-10 h-10 sm:w-12 sm:h-12 mb-4" />
            <p className="italic font-medium text-slate-400 text-sm sm:text-base">Memuat Pustaka Hadits...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Link 
                  key={book.id} 
                  to={`/hadits/${book.id}`} 
                  className="flex items-center justify-between p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-transparent hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      <BookText size={26} className="sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-base sm:text-lg truncate">{book.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-500">{book.available.toLocaleString()} Hadits</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 italic text-sm sm:text-base">Perawi tidak ditemukan dalam kategori ini.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}