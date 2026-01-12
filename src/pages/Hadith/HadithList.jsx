import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getHadithList } from "../../api/hadith"; 
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Hash, Search, X } from "lucide-react";

export default function HadithList() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      const start = (page - 1) * limit + 1;
      const end = page * limit;
      
      const result = await getHadithList(id, `${start}-${end}`);
      
      if (result && result.hadiths) {
        setData(result);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, page]);

  // FUNGSI HIGHLIGHT: Menandai teks yang cocok dengan warna
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    // Menggunakan regex untuk memisahkan teks berdasarkan query (case-insensitive)
    const parts = text.toString().split(new RegExp(`(${query})`, "gi"));
    
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 text-black rounded-sm px-0.5 font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredHadiths = data?.hadiths.filter((h) => {
    const query = searchQuery.toLowerCase();
    return (
      h.number.toString().includes(query) || 
      h.id.toLowerCase().includes(query) ||   
      h.arab.includes(query)                  
    );
  }) || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(searchQuery);

    if (!isNaN(num) && num > 0 && num <= data?.available) {
      const targetPage = Math.ceil(num / limit);
      if (targetPage !== page) {
        setPage(targetPage);
      }
      setTimeout(() => {
        const element = document.getElementById(`hadith-${num}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen text-emerald-600 bg-slate-50">
      <Loader2 className="animate-spin" size={40} />
      <p className="mt-4 font-bold italic text-slate-400">Menyusun barisan hadits...</p>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 p-6 text-center">
      <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 max-w-sm">
        <p className="text-red-500 font-bold text-lg mb-2">Data Tidak Ditemukan</p>
        <p className="text-sm text-slate-500">Koneksi terputus atau perawi tidak valid.</p>
      </div>
      <Link to="/hadits" className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold shadow-lg">Kembali ke Daftar</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-lg px-3 py-3 sm:px-6 sm:py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/hadits" className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-all active:scale-90 group">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex flex-col items-center flex-1 text-center">
              <h1 className="text-base sm:text-xl font-bold capitalize leading-none mb-1 drop-shadow-sm">
                {data.name}
              </h1>
              <p className="text-[9px] sm:text-[10px] opacity-80 font-medium tracking-[0.2em] uppercase">
                {data.available.toLocaleString()} TOTAL HADITS
              </p>
            </div>

            <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black min-w-[50px] text-center">
              HAL {page}
            </div> 
          </div>

          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor atau kata kunci di halaman ini..."
              className="w-full p-2.5 sm:p-3 pl-10 sm:pl-12 pr-10 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 bg-white shadow-inner transition-all placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
        {filteredHadiths.length === 0 ? (
          <div className="py-20 text-center text-slate-400 italic">
            <p>Tidak ditemukan hadits dengan kata kunci "{searchQuery}" di halaman ini.</p>
          </div>
        ) : (
          filteredHadiths.map((h) => (
            <div key={h.number} id={`hadith-${h.number}`} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group">
              <div className="flex justify-between items-center mb-8">
                <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-2xl text-xs font-black shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Hash size={14} /> NO. {highlightText(h.number, searchQuery)}
                </span>
              </div>
              
              {/* Highlight pada Teks Arab */}
              <p className="text-3xl md:text-4xl leading-[4.5rem] md:leading-[5rem] text-right font-arabic mb-10 text-slate-800" dir="rtl">
                {highlightText(h.arab, searchQuery)}
              </p>
              
              {/* Highlight pada Terjemahan */}
              <div className="bg-slate-50/50 p-6 rounded-3xl border-l-4 border-emerald-500">
                <p className="text-slate-600 text-sm md:text-base leading-relaxed italic">
                  "{highlightText(h.id, searchQuery)}"
                </p>
              </div>
            </div>
          ))
        )}

        {!searchQuery && (
          <div className="flex gap-4 pt-10">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-3xl font-bold text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50 shadow-sm text-sm"
            >
              <ChevronLeft size={20} /> Sebelumnya
            </button>
            
            <button 
              disabled={page * limit >= data.available}
              onClick={() => setPage(p => p + 1)}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-3xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-30 text-sm"
            >
              Berikutnya <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}