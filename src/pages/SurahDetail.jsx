import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSurahDetail } from "../api/quran";
import { ArrowLeft, PlayCircle } from "lucide-react";

export default function SurahDetail() {
  const { nomor } = useParams(); // Mengambil nomor surah dari URL
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSurahDetail(nomor).then((data) => {
      setDetail(data);
      setLoading(false);
    });
  }, [nomor]);

  if (loading) return <div className="p-10 text-center text-emerald-600">Membuka Surah...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Surah */}
      <div className="bg-emerald-600 p-8 text-white text-center rounded-b-[2rem] shadow-lg">
        <div className="max-w-4xl mx-auto relative">
          <Link to="/quran" className="absolute left-0 top-0"><ArrowLeft /></Link>
          <h1 className="text-3xl font-bold">{detail.namaLatin}</h1>
          <p className="text-emerald-100 mt-2">{detail.arti} • {detail.jumlahAyat} Ayat</p>
        </div>
      </div>

      {/* Daftar Ayat */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {detail.ayat.map((a) => (
          <div key={a.nomorAyat} className="border-b border-gray-100 pb-8">
            <div className="flex justify-between items-start mb-6">
              <span className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold">
                {a.nomorAyat}
              </span>
              <button className="text-emerald-500 hover:text-emerald-700">
                <PlayCircle size={24} />
              </button>
            </div>
            <p className="text-3xl leading-[3.5rem] text-right font-arabic mb-6 text-gray-800">
              {a.teksArab}
            </p>
            <p className="text-emerald-700 text-sm mb-2 italic">{a.teksLatin}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{a.teksIndonesia}</p>
          </div>
        ))}
      </main>
    </div>
  );
}