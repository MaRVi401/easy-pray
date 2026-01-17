import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDoaDetail } from "../../api/doa";
import { ArrowLeft, Loader2, Info } from "lucide-react";

export default function DoaDetail() {
  const { id } = useParams();
  const [doa, setDoa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Memastikan halaman selalu terbuka dari posisi paling atas
    window.scrollTo(0, 0);
    
    getDoaDetail(id).then((data) => {
      setDoa(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <Loader2 className="animate-spin text-emerald-600 w-10 h-10 mb-4" />
      <p className="text-slate-400 italic text-sm sm:text-base">Mengambil isi doa...</p>
    </div>
  );

  if (!doa) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-slate-600 font-medium">Doa tidak ditemukan.</p>
      <Link to="/doa" className="text-emerald-600 font-bold mt-4 hover:underline">Kembali ke Daftar</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Detail Header */}
      <div className="bg-emerald-600 text-white p-3 sm:p-5 sticky top-0 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/doa" className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <h2 className="font-bold text-sm sm:text-base md:text-xl truncate px-2 text-center flex-1">
            {doa.nama}
          </h2>
          {/* Spacer untuk keseimbangan layout */}
          <div className="w-9 sm:w-10"></div> 
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8">
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-5 sm:p-10 md:p-14">
            
            {/* Teks Arab - Tetap text-right agar natural bagi tulisan Arab */}
            <div className="mb-8 sm:mb-12">
              <p 
                className="text-right text-2xl sm:text-4xl md:text-5xl leading-[2.5] sm:leading-[2.8] md:leading-[3] text-slate-800 break-words" 
                style={{ fontFamily: "'Amiri', serif" }} 
                dir="rtl"
              >
                {doa.ar}
              </p>
            </div>

            {/* Transliterasi Latin - Ditambah text-justify */}
            <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-emerald-50 rounded-xl sm:rounded-2xl border-l-4 border-emerald-400 shadow-inner">
              <p className="text-emerald-800 italic text-xs sm:text-base md:text-lg leading-relaxed font-medium break-words text-justify">
                "{doa.tr}"
              </p>
            </div>

            {/* Terjemahan - Ditambah text-justify */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="h-[2px] w-6 sm:w-8 bg-emerald-600"></div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Terjemahan</span>
              </div>
              <p className="text-slate-600 text-sm sm:text-lg md:text-xl leading-relaxed font-medium text-justify">
                {doa.idn}
              </p>
            </div>
          </div>

          {/* Keterangan Tambahan - Ditambah text-justify */}
          {doa.tentang && (
            <div className="p-4 sm:p-6 md:p-8 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Sumber & Keterangan
                </span>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 leading-relaxed whitespace-pre-line italic break-all sm:break-words text-justify">
                  {doa.tentang}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-300 text-[9px] sm:text-[10px] mt-6 sm:mt-10 uppercase tracking-widest px-4 font-semibold">
           EasyPray v1.0 • Kedamaian dalam Doa
        </p>
      </main>
    </div>
  );
}