import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSholatByCoords, searchCity, getSholatByCityId } from "../../api/sholat";
import { ArrowLeft, Search, MapPin, Clock, Loader2, Calendar, X, Sparkles } from "lucide-react";

export default function Sholat() {
  const [jadwal, setJadwal] = useState(null);
  const [locationName, setLocationName] = useState("Mencari Lokasi...");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 1. Ambil lokasi otomatis saat pertama kali load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const data = await getSholatByCoords(latitude, longitude);
          if (data) {
            setJadwal(data.timings);
            // Membersihkan nama lokasi agar lebih rapi
            const cleanedLoc = data.location.includes('/') 
              ? data.location.split('/')[1].replace('_', ' ') 
              : data.location;
            setLocationName(cleanedLoc);
            setLoading(false);
          }
        },
        () => {
          // Jika GPS ditolak, default ke Jakarta
          handleSelectCity({ id: "1301", lokasi: "Jakarta" });
        }
      );
    } else {
      handleSelectCity({ id: "1301", lokasi: "Jakarta" });
    }
  }, []);

  // 2. Fungsi cari kota
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if (query.length > 2) {
      const cities = await searchCity(query);
      setSearchResults(cities || []);
    } else {
      setSearchResults([]);
    }
  };

  // 3. Pilih kota dari hasil pencarian
  const handleSelectCity = async (city) => {
    setLoading(true);
    setSearch("");
    setSearchResults([]);
    const data = await getSholatByCityId(city.id);
    if (data) {
      setJadwal(data.jadwal);
      setLocationName(data.lokasi);
    }
    setLoading(false);
  };

  const sholatList = [
    { name: "Imsak", time: jadwal?.imsak || jadwal?.Imsak },
    { name: "Subuh", time: jadwal?.subuh || jadwal?.Fajr },
    { name: "Terbit", time: jadwal?.terbit || jadwal?.Sunrise },
    { name: "Dzuhur", time: jadwal?.dzuhur || jadwal?.Dhuhr },
    { name: "Ashar", time: jadwal?.ashar || jadwal?.Asr },
    { name: "Maghrib", time: jadwal?.maghrib || jadwal?.Maghrib },
    { name: "Isya", time: jadwal?.isya || jadwal?.Isha },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Header Sticky Emerald - Identik dengan menu lain */}
      <div className="bg-emerald-600 text-white sticky top-0 z-40 shadow-lg px-3 py-3 sm:px-6 sm:py-5">
        <div className="max-w-5xl mx-auto">
          {/* Baris Atas: Tombol Kembali & Branding */}
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

          {/* Search Box Responsif */}
          <div className="relative group max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Cari Kota (Contoh: Indramayu, Bandung)..."
              className="w-full p-2.5 sm:p-3.5 pl-10 sm:pl-12 pr-10 rounded-xl sm:rounded-2xl text-xs sm:text-base text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 bg-white shadow-inner transition-all placeholder:text-gray-400 font-medium"
              value={search}
              onChange={handleSearch}
            />
            {search && (
              <button 
                onClick={() => {setSearch(""); setSearchResults([])}}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-600"
              >
                <X size={18} />
              </button>
            )}
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className="w-full p-4 text-left text-sm sm:text-base text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold border-b border-slate-50 transition-colors flex items-center gap-3"
                  >
                    <MapPin size={16} className="text-emerald-500" />
                    {city.lokasi}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="flex flex-col items-center py-24 text-emerald-600">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="italic font-bold tracking-widest text-slate-400 text-xs sm:text-sm uppercase">Menentukan Waktu Shalat...</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* Location Info Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center shadow-inner">
                  <MapPin size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none mb-2">{locationName}</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em]">
                    <Calendar size={14} className="text-emerald-500" /> 
                    {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                 <Sparkles className="text-emerald-100 w-12 h-12" />
              </div>
            </div>

            {/* Prayer Times List */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {sholatList.map((item) => (
                <div 
                  key={item.name}
                  className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-transparent hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 bg-slate-50 text-slate-400 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Clock size={24} />
                    </div>
                    <span className="font-black text-slate-700 text-base sm:text-lg group-hover:text-emerald-700 transition-colors uppercase tracking-wider">{item.name}</span>
                  </div>
                  <div className="text-right px-2">
                    <span className="text-2xl sm:text-4xl font-black text-emerald-600 tracking-tighter tabular-nums drop-shadow-sm">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-6">
               <p className="text-[10px] text-slate-300 uppercase tracking-[0.2em] font-black italic">
                Akurasi Berdasarkan Lokasi GPS Anda
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}