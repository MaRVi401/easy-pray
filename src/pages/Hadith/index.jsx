import React, { useState, useEffect } from "react";
import { Book, Search, ChevronRight, Hash } from "lucide-react";
import api from "../../api/hadith";

const Hadith = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  // 1. PERBAIKAN: Tambahkan kategori lain jika ingin muncul di menu
  const [categories] = useState(["Semua", "Kutubus Sittah", "Lainnya"]);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchTerm, activeCategory, books]);

  const fetchBooks = async () => {
    try {
      const data = await api.getHadithBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let result = books;

    // Filter berdasarkan Search
    if (searchTerm) {
      result = result.filter((b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan Kategori
    if (activeCategory === "Kutubus Sittah") {
      // 2. PERBAIKAN: Gunakan ID "abu-dawud" (pakai 'w') agar sesuai dengan API
      const mainBooks = ["bukhari", "muslim", "abu-dawud", "tirmidzi", "nasai", "ibnu-majah"];
      result = result.filter((b) => mainBooks.includes(b.id));
    } else if (activeCategory === "Lainnya") {
      const mainBooks = ["bukhari", "muslim", "abu-dawud", "tirmidzi", "nasai", "ibnu-majah"];
      result = result.filter((b) => !mainBooks.includes(b.id));
    }

    setFilteredBooks(result);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header & Search */}
      <div className="bg-emerald-600 pt-10 pb-20 px-4 rounded-b-[40px] shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Book className="w-8 h-8" />
            Hadist Online
          </h1>
          <p className="text-emerald-50 mb-8">Pelajari sabda Rasulullah SAW dari berbagai perawi</p>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari perawi (misal: Bukhari)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:ring-2 focus:ring-emerald-400 shadow-xl text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10">
        {/* 3. PERBAIKAN: Rendering Kategori secara Dinamis dari State */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 shadow-sm ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-emerald-200 scale-105"
                  : "bg-white text-gray-600 hover:bg-emerald-50 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List Books */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <a
                key={book.id}
                href={`/hadith/${book.id}`}
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-500">{book.available} Hadist</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hadith;