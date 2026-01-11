import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHadithBooks } from "../../api/hadith";
import { ArrowLeft, BookText, Loader2, ChevronRight, Search } from "lucide-react";

export default function Hadith() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHadithBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  const filteredBooks = books.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="bg-emerald-600 text-white sticky top-0 z-30 shadow-md p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-white/20 rounded-full transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold font-brand italic">Daftar Hadits</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari perawi (Bukhari, Muslim...)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin w-10 h-10 mb-2" />
            <p className="italic font-medium">Memuat Pustaka...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <Link key={book.id} to={`/hadits/${book.id}`} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-transparent hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <BookText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{book.name}</h3>
                    <p className="text-xs text-slate-500">{book.available} Hadits</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-emerald-500" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}