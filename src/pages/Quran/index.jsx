import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSurahList } from "../../api/quran";
import { Search, ArrowLeft, Play, Pause, Loader2, MapPin, BookOpen, Sparkles } from "lucide-react";

export default function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingSurah, setPlayingSurah] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSurahList();
        setSurahs(data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, [currentAudio]);

  const handlePlayFullSurah = async (e, audioUrl, nomor) => {
    e.preventDefault();
    e.stopPropagation();

    if (playingSurah === nomor) {
      if (currentAudio) currentAudio.pause();
      setPlayingSurah(null);
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
    }

    const audio = new Audio(audioUrl);
    try {
      setCurrentAudio(audio);
      setPlayingSurah(nomor);
      await audio.play();
    } catch (error) {
      console.error("Gagal memutar audio:", error.message);
      setPlayingSurah(null);
    }
    audio.onended = () => setPlayingSurah(null);
  };

  const filteredSurahs = surahs.filter((s) => {
    const normalize = (str) => str.toLowerCase().replace(/[\s-]/g, "");
    const term = normalize(search);
    return (
      normalize(s.namaLatin).includes(term) ||
      normalize(s.arti).includes(term) ||
      normalize(s.tempatTurun).includes(term) ||
      s.nomor.toString() === term
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans">
      {/* Header Sticky Emerald */}
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-lg px-3 py-3 sm:px-6 sm:py-5">
        <div className="max-w-5xl mx-auto">
          {/* Top Navigation */}
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
            <div className="w-8 sm:w-10"></div> 
          </div>

          {/* Search Input */}
          <div className="relative group max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Cari nama surah atau nomor..."
              className="w-full p-2.5 sm:p-3.5 pl-10 sm:pl-12 rounded-xl sm:rounded-2xl text-xs sm:text-base text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 bg-white shadow-inner transition-all placeholder:text-gray-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex flex-col items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin w-10 h-10 sm:w-12 sm:h-12 mb-4" />
            <p className="italic font-medium text-slate-400 text-sm sm:text-base">Menyiapkan Mushaf Digital...</p>
          </div>
        ) : (
          /* Grid Responsif: 1 Kolom (Mobile), 2 Kolom (Tablet), 3 Kolom (Desktop) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSurahs.length > 0 ? (
              filteredSurahs.map((surah) => (
                <div key={surah.nomor} className="relative group">
                  <Link
                    to={`/quran/${surah.nomor}`}
                    className="flex flex-col h-full bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-transparent hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
                  >
                    {/* Header Card: Nomor & Nama Arab */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                        {surah.nomor}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-arabic text-emerald-700 block leading-none mb-1">
                          {surah.nama}
                        </span>
                        <p className="text-[10px] sm:text-xs text-emerald-500 font-bold uppercase tracking-widest italic">
                          {surah.arti}
                        </p>
                      </div>
                    </div>

                    {/* Content Card: Latin & Info */}
                    <div className="mb-6">
                      <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl group-hover:text-emerald-700 transition-colors">
                        {surah.namaLatin}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] sm:text-xs font-semibold">
                          <MapPin size={14} className="text-emerald-500" />
                          {surah.tempatTurun}
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] sm:text-xs font-semibold">
                          <BookOpen size={14} className="text-emerald-500" />
                          {surah.jumlahAyat} Ayat
                        </div>
                      </div>
                    </div>

                    {/* Play Button Overlay (Mencegah Klik Link) */}
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Baca Surah</span>
                       <button
                        onClick={(e) => handlePlayFullSurah(e, surah.audioFull['01'], surah.nomor)}
                        className={`p-2.5 sm:p-3 rounded-full transition-all shadow-md ${
                          playingSurah === surah.nomor
                            ? 'bg-orange-500 text-white scale-110'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-110'
                        }`}
                      >
                        {playingSurah === surah.nomor ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <Sparkles className="w-12 h-12 text-emerald-100 mx-auto mb-4" />
                <p className="text-slate-400 italic text-sm sm:text-base font-medium">Surah tidak ditemukan...</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}