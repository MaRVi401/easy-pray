import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getHadithList } from "../../api/hadith"; 
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Hash } from "lucide-react";

export default function HadithList() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // State untuk Pengelompokan (Halaman)
  const [page, setPage] = useState(1);
  const limit = 20; // Jumlah hadits per kelompok

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      
      // Hitung jangkauan hadits (Contoh: Hal 1 = 1-20, Hal 2 = 21-40)
      const start = (page - 1) * limit + 1;
      const end = page * limit;
      const rangeParam = `${start}-${end}`;

      const result = await getHadithList(id, rangeParam);
      
      if (result && result.contents) {
        setData(result);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
    window.scrollTo(0, 0); // Kembali ke atas setiap ganti halaman
  }, [id, page]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen text-emerald-600 bg-slate-50">
      <Loader2 className="animate-spin" size={40} />
      <p className="mt-4 font-bold italic">Membuka lembaran hadits...</p>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4 p-6 text-center">
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
        <p className="text-red-500 font-bold">Waduh! Hadits tidak ditemukan atau koneksi terputus.</p>
        <p className="text-xs text-slate-400 mt-2">Pastikan internet aktif atau coba perawi lain.</p>
      </div>
      <Link to="/hadits" className="bg-emerald-600 text-white px-8 py-3 rounded-full shadow-lg">Kembali ke Daftar</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/hadits" className="p-2 hover:bg-white/20 rounded-full transition-all"><ArrowLeft /></Link>
            <div>
              <h1 className="text-lg font-bold capitalize">{data.name}</h1>
              <p className="text-[10px] opacity-80">{data.available} Total Hadits</p>
            </div>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest">HAL {page}</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {data.contents.map((h) => (
          <div key={h.number} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors">
            <div className="flex justify-between items-center mb-6">
              <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold">
                <Hash size={14} /> Nomor {h.number}
              </span>
            </div>
            <p className="text-3xl leading-[4.5rem] text-right font-arabic mb-8 text-slate-800" dir="rtl">{h.arab}</p>
            <div className="border-l-4 border-emerald-500 pl-4">
              <p className="text-slate-600 text-sm italic leading-relaxed">"{h.id}"</p>
            </div>
          </div>
        ))}

        {/* Tombol Navigasi Kelompok */}
        <div className="flex justify-between items-center pt-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 disabled:opacity-30 transition-all hover:bg-slate-50"
          >
            <ChevronLeft size={20} /> Sebelumnya
          </button>
          
          <button 
            disabled={page * limit >= data.available}
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-30"
          >
            Berikutnya <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}