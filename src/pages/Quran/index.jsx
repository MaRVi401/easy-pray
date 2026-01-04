import { useEffect, useState } from "react";
import { getSurahList } from "../../api/quran";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Play, Pause, Loader2 } from "lucide-react";

export default function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // --- State Audio ---
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingSurah, setPlayingSurah] = useState(null);

  // 1. Hook untuk mengambil data surah saat pertama kali load
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

  // 2. Hook untuk membersihkan audio saat berpindah halaman
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, [currentAudio]);

  // --- Fungsi Handle Play Full Surah ---
  const handlePlayFullSurah = async (e, audioUrl, nomor) => {
    e.preventDefault(); // Mencegah navigasi Link
    e.stopPropagation(); // Mencegah event merambat ke Link

    // Jika surah yang sama diklik, maka pause
    if (playingSurah === nomor) {
      if (currentAudio) {
        currentAudio.pause();
      }
      setPlayingSurah(null);
      return;
    }

    // Jika ada audio lain yang berputar, matikan dulu
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
    }

    const audio = new Audio(audioUrl);

    try {
      setCurrentAudio(audio);
      setPlayingSurah(nomor);

      // Menunggu audio siap diputar untuk menghindari AbortError
      await audio.play();
    } catch (error) {
      console.error("Gagal memutar audio:", error.message);
      setPlayingSurah(null);
    }

    audio.onended = () => {
      setPlayingSurah(null);
    };
  };

  // --- Logika Pencarian ---
  const filteredSurahs = surahs.filter((s) =>
    s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
    s.nomor.toString().includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header & Search Section */}
      <div className="bg-emerald-600 p-6 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm font-medium hover:bg-white hover:text-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group shadow-lg"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-2xl font-bold mb-4 text-center">Easy Pray</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama surah atau nomor..."
              className="w-full p-3 pl-10 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content: List Surah */}
      <main className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="text-emerald-600 font-medium italic">Memuat Al-Qur'an...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.nomor}
                to={`/quran/${surah.nomor}`}
                className="group grid grid-cols-12 items-center p-5 bg-white rounded-2xl shadow-sm border border-emerald-50 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                {/* Bagian Kiri: Nomor dan Nama Latin (Kolom 1-5) */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    {surah.nomor}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{surah.namaLatin}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
                      {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                    </p>
                  </div>
                </div>

                {/* Bagian Tengah: Tombol Play (Kolom 6-7) */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={(e) => handlePlayFullSurah(e, surah.audioFull['01'], surah.nomor)}
                    className={`p-3 rounded-full transition-all duration-300 shadow-sm ${playingSurah === surah.nomor
                        ? 'bg-orange-500 text-white scale-110 shadow-orange-200'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                      }`}
                  >
                    {playingSurah === surah.nomor ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                  </button>
                </div>

                {/* Bagian Kanan: Nama Arab dan Arti (Kolom 8-12) */}
                <div className="col-span-5 text-right border-l pl-4 border-emerald-50">
                  <span className="text-2xl font-arabic text-emerald-700 block leading-none mb-1">
                    {surah.nama}
                  </span>
                  <p className="text-[10px] text-emerald-500 font-medium truncate">{surah.arti}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredSurahs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Surah yang kamu cari tidak ditemukan.
          </div>
        )}
      </main>
    </div>
  );
}