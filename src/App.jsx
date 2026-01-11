import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quran from './pages/Quran';
import SurahDetail from './pages/Quran/SurahDetail';
import Hadith from './pages/Hadith';
import HadithList from './pages/Hadith/HadithList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Fitur Quran */}
        <Route path="/quran" element={<Quran />} />
        <Route path="/quran/:nomor" element={<SurahDetail />} />
        
        {/* Fitur Hadits */}
        <Route path="/hadits" element={<Hadith />} />
        <Route path="/hadits/:id" element={<HadithList />} />
        
        {/* Placeholder lainnya */}
        <Route path="/jadwal" element={<div className="p-10 text-center">Fitur Jadwal Sholat Segera Hadir</div>} />
        <Route path="/doa" element={<div className="p-10 text-center">Fitur Doa Segera Hadir</div>} />
      </Routes>
    </Router>
  );
}

export default App;