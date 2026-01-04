import { useEffect, useState } from "react";
import { getSurahList } from "../../api/quran";
import { Link } from "react-router-dom";
// Import ikon yang dibutuhkan dari lucide-react
import { Search, ArrowLeft, Play, Pause, Loader2, Hash, Globe, MapPin, BookOpen } from "lucide-react";

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
    const nameLatin = normalize(s.namaLatin);
    const meaning = normalize(s.arti);
    const location = normalize(s.tempatTurun); 
    const verseCount = s.jumlahAyat.toString(); 
    const surahNumber = s.nomor.toString();     

    return (
      nameLatin.includes(term) || 
      meaning.includes(term) || 
      location.includes(term) ||
      verseCount === term ||
      surahNumber === term
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
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

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Cari nama, arti, lokasi turun (Mekah/Madinah), atau jumlah ayat..."
              className="w-full p-2.5 sm:p-3 pl-10 sm:pl-12 rounded-xl sm:rounded-2xl text-[10px] sm:text-base text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 bg-white shadow-inner transition-all placeholder:text-gray-400 font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-3 sm:p-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-4">
            <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
            <p className="text-emerald-600 font-medium animate-pulse text-sm">Menyiapkan Mushaf...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.nomor}
                to={`/quran/${surah.nomor}`}
                className="group grid grid-cols-12 items-center p-3 sm:p-5 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-transparent hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="col-span-5 flex items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0 bg-emerald-50 text-emerald-700 rounded-lg sm:rounded-2xl flex items-center justify-center text-xs sm:text-base font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    {surah.nomor}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base truncate leading-tight">
                      {surah.namaLatin}
                    </h3>
                    {/* MODIFIKASI IKON DI SINI */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                      {/* Ikon Lokasi (MapPin) */}
                      <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-slate-500 font-semibold tracking-tight bg-slate-100 px-2 py-0.5 rounded-full">
                        <MapPin size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" strokeWidth={2.5} />
                        {surah.tempatTurun}
                      </div>
                      {/* Ikon Jumlah Ayat (BookOpen) */}
                      <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-slate-500 font-semibold tracking-tight bg-slate-100 px-2 py-0.5 rounded-full">
                        <BookOpen size={12} className="text-emerald-500 sm:w-[14px] sm:h-[14px]" strokeWidth={2.5} />
                        {surah.jumlahAyat} Ayat
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={(e) => handlePlayFullSurah(e, surah.audioFull['01'], surah.nomor)}
                    className={`p-2 sm:p-3 rounded-full transition-all duration-300 ${
                      playingSurah === surah.nomor
                        ? 'bg-orange-500 text-white scale-110 shadow-lg'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:scale-105'
                    }`}
                  >
                    {playingSurah === surah.nomor ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </button>
                </div>

                <div className="col-span-5 text-right border-l pl-2 sm:pl-4 border-slate-50">
                  <span className="text-lg sm:text-2xl font-arabic text-emerald-700 block leading-none mb-1">
                    {surah.nama}
                  </span>
                  <p className="text-[9px] sm:text-[11px] text-emerald-500 font-medium truncate italic leading-tight">
                    {surah.arti}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredSurahs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search size={32} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium text-sm sm:text-base">Hasil pencarian tidak ditemukan.</p>
          </div>
        )}
      </main>
    </div>
  );
}