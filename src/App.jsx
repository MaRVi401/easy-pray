import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quran from './pages/Quran';
import SurahDetail from './pages/Quran/SurahDetail';
import Hadith from './pages/Hadith';
import HadithList from './pages/Hadith/HadithList';
import DoaIndex from "./pages/Doa/index";
import DoaDetail from "./pages/Doa/DoaDetail";
import Sholat from "./pages/Sholat";
import Kiblat from "./pages/Kiblat";

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Home */}
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

        {/* Fitur Jadwal Sholat */}
        <Route path="/jadwal-sholat" element={<Sholat />} />

        {/* Fitur Arah Kiblat */}
        <Route path="/kiblat" element={<Kiblat />} />
      </Routes>
    </Router>
  );
}

export default App;