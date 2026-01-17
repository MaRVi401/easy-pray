import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHadithBooks } from "../../api/hadith";
import { ArrowLeft, BookText, Loader2, ChevronRight, Search } from "lucide-react";

export default function Hadith() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  // Daftar kategori yang akan ditampilkan di menu
  const [categories] = useState(["Semua", "Kutubus Sittah", "Lainnya"]);

  // ID yang benar untuk API Gading adalah "abu-dawud" (pakai 'w')
  const mainBooks = ["bukhari", "muslim", "abu-dawud", "tirmidzi", "nasai", "ibnu-majah"];

  useEffect(() => {
    getHadithBooks().then((data) => {
      setBooks(data || []);
      setLoading(false);
    });
  }, []);

  // Logika Filter yang diperbaiki
  const filteredBooks = books.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    
    if (activeCategory === "Kutubus Sittah") {
      return matchSearch && mainBooks.includes(b.id);
    }
    
    if (activeCategory === "Lainnya") {
      return matchSearch && !mainBooks.includes(b.id);
    }

    return matchSearch; // Untuk kategori "Semua"
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header Easy Pray */}
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-lg px-3 py-3 sm:px-6 sm:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all active:scale-90 group">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/icon/icon1.svg" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm" />
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-lg sm:text-2xl font-extrabold tracking-tighter italic select-none">
                <span className="bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent pr-2">Easy</span>
                <span className="text-emerald-950">Pray</span>
              </h1>
            </div>
            <div className="w-8 sm:w-10"></div> 
          </div>

          {/* Search Input */}
          <div className="relative group mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Cari nama perawi (Bukhari, Muslim, dsb)..."
              className="w-full p-2.5 sm:p-3 pl-10 sm:pl-12 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 bg-white shadow-inner transition-all placeholder:text-gray-400 font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Kategori Dinamis */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all ${
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

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin w-10 h-10 mb-2" />
            <p className="italic font-medium text-slate-400">Memuat Pustaka Hadits...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Link key={book.id} to={`/hadits/${book.id}`} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-transparent hover:border-emerald-300 hover:shadow-md transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <BookText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{book.name}</h3>
                      <p className="text-xs text-slate-500">{book.available?.toLocaleString()} Hadits</p>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-emerald-500" />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-400 italic">
                Perawi tidak ditemukan...
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}