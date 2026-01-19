import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Fingerprint, Sparkles, Vibrate, VibrateOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DzikirPage() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('easy-pray-dzikir-count');
    return saved ? parseInt(saved) : 0;
  });

  const [vibrateEnabled, setVibrateEnabled] = useState(() => {
    const saved = localStorage.getItem('easy-pray-vibrate');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [milestoneReached, setMilestoneReached] = useState(false);

  useEffect(() => {
    localStorage.setItem('easy-pray-dzikir-count', count);
    if (count > 0 && count % 33 === 0) {
      setMilestoneReached(true);
      if (vibrateEnabled && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      setTimeout(() => setMilestoneReached(false), 2000);
    }
  }, [count, vibrateEnabled]);

  useEffect(() => {
    localStorage.setItem('easy-pray-vibrate', JSON.stringify(vibrateEnabled));
  }, [vibrateEnabled]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    if (vibrateEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const resetCount = () => {
    setCount(0);
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* HEADER: Sudut diperhalus (tidak oval) dan ukuran lebih pas */}
      <header className="bg-emerald-600 text-white pt-8 pb-20 px-6 rounded-b-[2rem] shadow-lg relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-90">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            
            <div className="flex items-center gap-2">
              <img src="/icon/icon1.svg" alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8" />
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-lg sm:text-xl font-extrabold tracking-tighter italic select-none">
                <span className="bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent pr-1">Easy</span>
                <span className="text-emerald-950">Pray</span>
              </h1>
            </div>

            <button 
              onClick={() => setVibrateEnabled(!vibrateEnabled)}
              className={`p-2 rounded-xl border transition-all ${vibrateEnabled ? 'bg-white/20 border-white/30' : 'bg-rose-500/20 border-rose-400/30 text-rose-100'}`}
            >
              {vibrateEnabled ? <Vibrate size={18} /> : <VibrateOff size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: Responsif terhadap tinggi layar */}
      <main className="flex-1 max-w-lg mx-auto -mt-12 px-4 w-full relative z-20 pb-8">
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative flex flex-col h-full min-h-[500px]">
          
          {/* Milestone Notification */}
          <div className={`absolute top-0 left-0 right-0 p-3 bg-amber-500 text-white text-center font-bold text-xs transition-all duration-500 transform z-30 ${milestoneReached ? 'translate-y-0' : '-translate-y-full'}`}>
             Subhanallah! Mencapai {count}x ✨
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
            {/* Counter Display */}
            <div className="text-center mb-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-1 block transition-colors ${milestoneReached ? 'text-amber-500' : 'text-slate-400'}`}>
                {milestoneReached ? 'Target Tercapai' : 'Total Dzikir'}
              </span>
              <div className={`text-7xl sm:text-8xl font-black tracking-tighter tabular-nums transition-all duration-300 ${milestoneReached ? 'text-amber-500 scale-110' : 'text-slate-800'}`}>
                {count}
              </div>
            </div>

            {/* Tombol Utama: Ukuran dinamis sesuai layar */}
            <button
              onClick={handleIncrement}
              className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-slate-50 border-[10px] shadow-lg flex items-center justify-center group active:scale-90 transition-all duration-100 cursor-pointer overflow-hidden ${milestoneReached ? 'border-amber-100' : 'border-white'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-active:opacity-10 transition-opacity ${milestoneReached ? 'bg-amber-500' : 'bg-emerald-600'}`}></div>
              
              <div className="flex flex-col items-center gap-3">
                <div className={`p-5 rounded-3xl shadow-md transition-all duration-300 ${milestoneReached ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
                  <Fingerprint className="w-10 h-10" />
                </div>
                <span className={`font-black uppercase tracking-[0.2em] text-[9px] ${milestoneReached ? 'text-amber-600' : 'text-emerald-600'}`}>Ketuk Disini</span>
              </div>
            </button>

            {/* Reset Button */}
            <button
              onClick={() => setShowResetModal(true)}
              className="mt-10 flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 border border-rose-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Hitungan
            </button>
          </div>
        </div>
      </main>

      {/* MODAL RESET */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in duration-300">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <RotateCcw size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800 text-center mb-1 uppercase tracking-tight">Reset Hitungan?</h3>
            <p className="text-slate-500 text-center text-xs font-medium mb-6 leading-relaxed">
              Progres dzikir Anda akan kembali ke nol.
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={resetCount}
                className="w-full py-3.5 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                Ya, Reset
              </button>
              <button 
                onClick={() => setShowResetModal(false)}
                className="w-full py-3.5 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}