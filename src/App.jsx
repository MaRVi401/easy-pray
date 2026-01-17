import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quran from './pages/Quran';
import SurahDetail from './pages/Quran/SurahDetail';
import Hadith from './pages/Hadith';
import HadithList from './pages/Hadith/HadithList';
import DoaIndex from "./pages/Doa/index";
import DoaDetail from "./pages/Doa/DoaDetail";

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
        
        {/* Fitur Doa */}
        <Route path="/doa" element={<DoaIndex />} />
        <Route path="/doa/:id" element={<DoaDetail />} />

        {/* Placeholder lainnya */}
        <Route path="/jadwal" element={<div className="p-10 text-center">Fitur Jadwal Sholat Segera Hadir</div>} />
      </Routes>
    </Router>
  );
}

export default App;