import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Quran from './pages/Quran';
import SurahDetail from './pages/SurahDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/quran/:nomor" element={<SurahDetail />} />
        {/* Route lainnya nanti */}
      </Routes>
    </Router>
  );
}

export default App;