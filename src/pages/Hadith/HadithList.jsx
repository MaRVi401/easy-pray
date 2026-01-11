// Ganti isi HadithList.jsx dengan versi "Bulletproof" ini
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getHadithList } from "../../api/hadith"; // Pastikan path ini benar
import { ArrowLeft, Loader2, BookOpen } from "lucide-react";

export default function HadithList() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchNum, setSearchNum] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const result = await getHadithList(id, "1-50");
        // API Sutanlab mengembalikan { code: 200, data: { ... } }
        // getHadithList kita sebelumnya hanya me-return data.data
        if (result && result.contents) {
          setData(result);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen text-emerald-600 bg-slate-50">
      <Loader2 className="animate-spin" size={40} />
      <p className="mt-4 font-bold italic">Membuka lembaran hadits...</p>
    </div>
  );

  if (error || !data) return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <p className="text-red-500 font-bold text-center">Waduh! Hadits tidak ditemukan <br/> atau koneksi terputus.</p>
      <Link to="/hadits" className="bg-emerald-600 text-white px-6 py-2 rounded-full">Kembali</Link>
    </div>
  );

  const filteredContents = data.contents?.filter((h) =>
    h.number.toString().includes(searchNum)
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/hadits" className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold">{data.name}</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <input
          type="number"
          placeholder="Cari nomor hadist..."
          className="w-full px-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
          value={searchNum}
          onChange={(e) => setSearchNum(e.target.value)}
        />

        {filteredContents.map((h) => (
          <div key={h.number} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
              Hadits No. {h.number}
            </span>
            <p className="text-2xl leading-[3.5rem] text-right font-arabic my-6 text-slate-800" dir="rtl">
              {h.arab}
            </p>
            <p className="text-slate-600 text-sm italic border-l-4 border-emerald-500 pl-4">
              "{h.id}"
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}