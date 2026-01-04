import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSurahDetail, getSurahTafsir } from "../../api/quran"; 
import { ArrowLeft, PlayCircle, PauseCircle, BookOpen, Loader2 } from "lucide-react";

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
    <div className="flex flex-col justify-center items-center min-h-screen text-emerald-600 gap-4">
      <Loader2 className="animate-spin" size={40} />
      <p className="font-bold italic animate-pulse">Membuka Mushaf...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER RESPONSIF: Padding mengecil di mobile */}
      <div className="bg-emerald-600 px-4 py-6 md:p-8 text-white text-center rounded-b-[1.5rem] md:rounded-b-[2.5rem] shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto relative">
          <Link to="/quran" className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <h1 className="text-xl md:text-3xl font-bold tracking-wide">{detail.namaLatin}</h1>
          <p className="text-emerald-100 text-xs md:text-base mt-1 md:mt-2">
            {detail.arti} • {detail.jumlahAyat} Ayat
          </p>
        </div>
      </div>

      {/* Container Utama: Padding disesuaikan agar tidak mepet di HP */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 md:space-y-10">
        {detail.ayat.map((a) => (
          <div key={a.nomorAyat} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-emerald-50">
            
            {/* AYAT HEADER: Penyesuaian ukuran tombol di mobile */}
            <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-emerald-600 text-white rounded-lg md:rounded-xl shadow-md text-xs md:text-base font-bold">
                {a.nomorAyat}
              </div>
              
              <div className="flex gap-2 md:gap-4">
                <button 
                  onClick={() => toggleTafsir(a.nomorAyat)}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-sm font-semibold transition-all border ${
                    visibleTafsir[a.nomorAyat] 
                      ? 'bg-amber-100 border-amber-300 text-amber-700' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <BookOpen size={16} className="md:w-[18px] md:h-[18px]" />
                  <span>{visibleTafsir[a.nomorAyat] ? 'Tutup' : 'Tafsir'}</span>
                </button>

                <button 
                  onClick={() => handlePlayAudio(a.audio['01'], a.nomorAyat)}
                  className="text-emerald-600 hover:text-emerald-800 transition-colors"
                >
                  {playingId === a.nomorAyat ? (
                    <PauseCircle className="w-8 h-8 md:w-10 md:h-10 fill-emerald-50" />
                  ) : (
                    <PlayCircle className="w-8 h-8 md:w-10 md:h-10" />
                  )}
                </button>
              </div>
            </div>
            
            {/* TEXT ARAB: Skala font dinamis agar tidak overflow di layar kecil */}
            <p className="text-2xl md:text-4xl leading-[3.5rem] md:leading-[5rem] text-right font-arabic mb-6 md:mb-10 text-slate-800 antialiased">
              {a.teksArab}
            </p>
            
            {/* TERJEMAHAN: Ukuran teks lebih kecil di mobile */}
            <div className="space-y-2 md:space-y-4">
              <p className="text-emerald-700 font-medium italic text-[11px] md:text-sm leading-relaxed">
                {a.teksLatin}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {a.teksIndonesia}
              </p>
            </div>

            {/* BOX TAFSIR RESPONSIF */}
            {visibleTafsir[a.nomorAyat] && (
              <div className="mt-6 p-4 md:p-6 bg-amber-50 rounded-xl md:rounded-2xl border-l-4 border-amber-400 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="font-bold text-amber-900 text-xs md:text-base mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="md:w-4 md:h-4" /> Tafsir Ayat {a.nomorAyat}
                </h4>
                <p className="text-amber-950 text-xs md:text-sm leading-relaxed md:leading-loose text-justify">
                  {
                    tafsir?.tafsir?.find(t => Number(t.ayat) === Number(a.nomorAyat))?.teks 
                    || "Tafsir sedang tidak tersedia."
                  }
                </p>
                <p className="mt-4 text-[9px] md:text-[10px] text-amber-600 italic">Sumber: Kemenag RI</p>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}