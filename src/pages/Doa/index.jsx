import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoaList } from "../../api/doa";
import { ArrowLeft, Search, Loader2, ChevronRight, Sparkles } from "lucide-react";

export default function DoaIndex() {
  const [doas, setDoas] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoaList().then((data) => {
      if (data) setDoas(data);
      setLoading(false);
    });
  }, []);

  const filteredDoa = doas.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans">
      {/* Header Sticky */}
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-lg px-4 py-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-95 group">
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3">
              <img src="/icon/icon1.svg" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md" />
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-xl sm:text-3xl font-extrabold tracking-tighter italic">
                <span className="bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">Easy </span>
                <span className="text-emerald-950">Pray</span>
              </h1>
            </div>
            <div className="w-10"></div> 
          </div>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari doa harian..."
              className="w-full p-4 pl-12 rounded-2xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 bg-white shadow-xl transition-all placeholder:text-gray-400 font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        {loading ? (
          <div className="flex flex-col items-center py-24 text-emerald-600">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="italic font-medium text-slate-400">Menyiapkan kumpulan doa...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoa.length > 0 ? (
              filteredDoa.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/doa/${item.id}`} 
                  className="bg-white p-6 rounded-[2rem] border border-transparent hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon Love Diganti dengan Sparkles yang lebih sesuai */}
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-inner">
                      <Sparkles size={24} />
                    </div>
                    <div className="bg-emerald-50 px-3 py-1 rounded-full group-hover:bg-emerald-100 transition-colors">
                       <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Doa Harian</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-800 text-lg sm:text-xl leading-tight group-hover:text-emerald-700 transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic">
                      {item.grup}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 group/btn">
                    <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">Lihat Doa</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover/btn:text-emerald-500 group-hover/btn:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 italic font-medium">Doa tidak ditemukan...</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}