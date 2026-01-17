import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSurahDetail, getSurahTafsir } from "../../api/quran"; 
import { ArrowLeft, PlayCircle, PauseCircle, BookOpen, Loader2, Info } from "lucide-react";

export default function SurahDetail() {
  const { nomor } = useParams();
  const [detail, setDetail] = useState(null);
  const [tafsir, setTafsir] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [visibleTafsir, setVisibleTafsir] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [suratData, tafsirData] = await Promise.all([
          getSurahDetail(nomor),
          getSurahTafsir(nomor)
        ]);
        setDetail(suratData);
        setTafsir(tafsirData);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
    
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, [nomor]);

  const handlePlayAudio = (url, id) => {
    if (currentAudio) {
      currentAudio.pause();
      if (playingId === id) {
        setPlayingId(null);
        setCurrentAudio(null);
        return;
      }
    }
    const audio = new Audio(url);
    setCurrentAudio(audio);
    setPlayingId(id);
    audio.play();
    audio.onended = () => setPlayingId(null);
  };

  const toggleTafsir = (ayatId) => {
    setVisibleTafsir((prev) => ({
      ...prev,
      [ayatId]: !prev[ayatId], 
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col justify-center items-center text-emerald-600 gap-4 bg-white">
      <Loader2 className="animate-spin" size={48} />
      <p className="font-bold italic animate-pulse tracking-widest text-sm text-center px-4">MEMBUKA MUSHAF...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER: Dibuat kotak dengan menghapus class rounded-b */}
      <header className="bg-emerald-600 text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 py-5 md:py-8">
          <div className="flex items-center justify-between relative">
            <Link to="/quran" className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90 group">
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
            </Link>
            
            <div className="text-center flex-1 px-4">
              <h1 className="text-lg md:text-3xl font-black tracking-tight uppercase leading-tight">
                {detail.namaLatin}
              </h1>
              <p className="text-emerald-100 text-[10px] md:text-sm font-bold opacity-90 mt-0.5 md:mt-1 uppercase tracking-[0.2em]">
                {detail.arti} • {detail.jumlahAyat} Ayat
              </p>
            </div>

            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* BISMILLAH SECTION */}
      {nomor !== "1" && nomor !== "9" && (
        <div className="text-center py-10 md:py-16">
          <p className="font-arabic text-3xl md:text-4xl text-slate-800 antialiased">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* CONTENT LIST */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-12">
        {detail.ayat.map((a) => (
          <div key={a.nomorAyat} className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
            
            <div className="bg-slate-50/50 px-5 md:px-8 py-4 flex justify-between items-center border-b border-slate-100">
              <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-emerald-600 text-white rounded-xl md:rounded-2xl shadow-lg shadow-emerald-100 text-sm md:text-lg font-black">
                {a.nomorAyat}
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => toggleTafsir(a.nomorAyat)}
                  className={`flex items-center gap-2 px-3 md:px-5 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border ${
                    visibleTafsir[a.nomorAyat] 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-600'
                  }`}
                >
                  <BookOpen size={14} className="md:w-4 md:h-4" />
                  <span className="hidden xs:inline">{visibleTafsir[a.nomorAyat] ? 'Tutup' : 'Tafsir'}</span>
                </button>

                <button 
                  onClick={() => handlePlayAudio(a.audio['01'], a.nomorAyat)}
                  className={`p-1.5 md:p-2 rounded-full transition-all duration-300 ${
                    playingId === a.nomorAyat 
                      ? 'text-orange-500 scale-110' 
                      : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {playingId === a.nomorAyat ? (
                    <PauseCircle className="w-9 h-9 md:w-11 md:h-11 fill-orange-50" />
                  ) : (
                    <PlayCircle className="w-9 h-9 md:w-11 md:h-11" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-6 md:p-10">
              <p 
                className="text-2xl md:text-5xl leading-[3rem] md:leading-[5.5rem] text-right font-arabic text-slate-800 mb-8 md:mb-12" 
                dir="rtl"
                style={{ wordSpacing: '4px' }}
              >
                {a.teksArab}
              </p>
              
              <div className="space-y-4 md:space-y-6">
                <div className="p-4 bg-emerald-50/50 rounded-2xl border-l-4 border-emerald-400">
                  <p className="text-emerald-800 italic text-xs md:text-base leading-relaxed font-medium">
                    {a.teksLatin}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Terjemahan</span>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-lg font-medium">
                    {a.teksIndonesia}
                  </p>
                </div>
              </div>

              {visibleTafsir[a.nomorAyat] && (
                <div className="mt-8 p-5 md:p-8 bg-amber-50/50 rounded-3xl border border-amber-100 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 mb-4 text-amber-700">
                    <Info size={16} />
                    <h4 className="font-black text-[10px] md:text-xs uppercase tracking-widest">
                      Tafsir Ayat {a.nomorAyat}
                    </h4>
                  </div>
                  <p className="text-amber-950 text-xs md:text-base leading-relaxed md:leading-loose text-justify font-medium">
                    {
                      tafsir?.tafsir?.find(t => Number(t.ayat) === Number(a.nomorAyat))?.teks 
                      || "Tafsir sedang tidak tersedia untuk ayat ini."
                    }
                  </p>
                  <div className="mt-6 pt-4 border-t border-amber-100 flex justify-between items-center">
                    <p className="text-[9px] md:text-[10px] text-amber-600 italic font-bold uppercase tracking-tighter">Sumber: Kemenag RI</p>
                    <div className="h-1 w-10 bg-amber-200 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      <footer className="text-center py-10 opacity-30">
        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-slate-400">
          EasyPray • Digital Mushaf
        </p>
      </footer>
    </div>
  );
}