import { useEffect, useState } from "react";
import { getSurahList } from "../api/quran";
import { Link } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";

export default function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSurahList().then((data) => {
      setSurahs(data);
      setLoading(false);
    });
  }, []);

  // Logika pencarian
  const filteredSurahs = surahs.filter((s) =>
    s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
    s.nomor.toString().includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header & Search */}
      <div className="bg-emerald-600 p-6 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-4 text-emerald-100">
            <ArrowLeft size={20} /> Kembali
          </Link>
          <h1 className="text-2xl font-bold mb-4 text-center">Al-Qur'an Digital</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama surah atau nomor..."
              className="w-full p-3 pl-10 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* List Surah */}
      <main className="max-w-4xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-emerald-600 animate-pulse">Memuat Al-Qur'an...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.nomor}
                to={`/quran/${surah.nomor}`}
                className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-emerald-50 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold">
                    {surah.nomor}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{surah.namaLatin}</h3>
                    <p className="text-xs text-gray-500 uppercase">{surah.tempatTurun} • {surah.jumlahAyat} Ayat</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-arabic text-emerald-600">{surah.nama}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}