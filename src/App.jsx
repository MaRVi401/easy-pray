import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

// Component dummy untuk halaman lain (bisa kamu isi nanti)
const Quran = () => <div className="p-8 text-center">Halaman Quran (Coming Soon)</div>;
const Jadwal = () => <div className="p-8 text-center">Halaman Jadwal Sholat (Coming Soon)</div>;
const Hadits = () => <div className="p-8 text-center">Halaman Hadits (Coming Soon)</div>;
const Doa = () => <div className="p-8 text-center">Halaman Doa (Coming Soon)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/hadits" element={<Hadits />} />
        <Route path="/doa" element={<Doa />} />
      </Routes>
    </Router>
  );
}

export default App;