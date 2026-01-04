import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Gunakan nama yang konsisten
import Home from './pages/Home'; 
import Quran from './pages/Quran'; 
import SurahDetail from './pages/Quran/SurahDetail'; 

// Hapus import JadwalSholat yang bentrok jika ada
// import JadwalSholat from './pages/JadwalSholat'; 

const Jadwal = () => <div className="p-8 text-center">E eehhhhh nanti sabar dulu!</div>;
const Hadits = () => <div className="p-8 text-center">E eehhhhh nanti sabar dulu!</div>;
const Doa = () => <div className="p-8 text-center">E eehhhhh nanti sabar dulu!</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Pastikan element-nya sesuai dengan nama import di atas (Home, bukan LandingPage) */}
        <Route path="/" element={<Home />} /> 
        <Route path="/quran" element={<Quran />} />
        <Route path="/quran/:nomor" element={<SurahDetail />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/hadits" element={<Hadits />} />
        <Route path="/doa" element={<Doa />} />
      </Routes>
    </Router>
  );
}

export default App;