import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Fingerprint, Vibrate, VibrateOff } from 'lucide-react';
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

  // Simpan data ke localStorage
  useEffect(() => {
    localStorage.setItem('easy-pray-dzikir-count', count);
  }, [count]);

  useEffect(() => {
    localStorage.setItem('easy-pray-vibrate', JSON.stringify(vibrateEnabled));
  }, [vibrateEnabled]);

  // FUNGSI UTAMA: Tambah hitungan & Getar
  const handleIncrement = () => {
    const nextCount = count + 1;
    setCount(nextCount);

    // Jalankan getar hanya jika fitur diaktifkan dan browser mendukung
    if (vibrateEnabled && navigator.vibrate) {
      if (nextCount > 0 && nextCount % 33 === 0) {
        // Pola getar khusus untuk kelipatan 33
        navigator.vibrate([200, 100, 200]);
        
        // Trigger visual milestone
        setMilestoneReached(true);
        setTimeout(() => setMilestoneReached(false), 2000);
      } else {
        // Getar standar (60ms) setiap kali klik
        navigator.vibrate(60);
      }
    } else if (nextCount % 33 === 0) {
      // Jika getar mati, tetap munculkan visual milestone
      setMilestoneReached(true);
      setTimeout(() => setMilestoneReached(false), 2000);
    }
  };

  const resetCount = () => {
    setCount(0);
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col transition-colors duration-500">
      {/* HEADER */}
      <header className="bg-emerald-600 text-white pt-8 pb-24 md:pb-32 lg:pb-40 px-6 rounded-b-[2.5rem] lg:rounded-b-[4rem] shadow-xl relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 lg:w-64 lg:h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="p-2 md:p-3 hover:bg-white/20 rounded-2xl transition-all active:scale-90 bg-white/10 backdrop-blur-sm border border-white/20">
              <ArrowLeft className="w-5 h-5 md:w-7 md:h-7" />
            </Link>
            
            <div className="flex items-center gap-3 md:gap-5">
              <img 
                src="/icon/icon1.svg" 
                alt="Logo" 
                className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 drop-shadow-lg transition-all" 
              />
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter italic select-none">
                <span className="bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent pr-1">Easy</span>
                <span className="text-emerald-950">Pray</span>
              </h1>
            </div>

            <button 
              onClick={() => setVibrateEnabled(!vibrateEnabled)}
              className={`p-2 md:p-3 rounded-2xl border transition-all shadow-lg ${vibrateEnabled ? 'bg-white/20 border-white/30' : 'bg-rose-500 border-rose-400 text-white'}`}
            >
              {vibrateEnabled ? <Vibrate className="w-5 h-5 md:w-6 md:h-6" /> : <VibrateOff className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-xl mx-auto -mt-16 md:-mt-24 lg:-mt-28 px-4 w-full relative z-20 pb-12">
        <div className="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col min-h-[550px] md:min-h-[650px] lg:min-h-[700px]">
          
          <div className={`absolute top-0 left-0 right-0 p-4 bg-amber-500 text-white text-center font-bold text-sm md:text-base transition-all duration-500 transform z-30 shadow-lg ${milestoneReached ? 'translate-y-0' : '-translate-y-full'}`}>
             Subhanallah! Mencapai {count}x ✨
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12">
            <div className="text-center mb-10 md:mb-16">
              <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-2 block transition-colors ${milestoneReached ? 'text-amber-500' : 'text-slate-400'}`}>
                {milestoneReached ? 'Target Tercapai' : 'Total Dzikir'}
              </span>
              <div className={`text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter tabular-nums transition-all duration-500 leading-none ${milestoneReached ? 'text-amber-500 scale-110' : 'text-slate-800'}`}>
                {count}
              </div>
            </div>

            <button
              onClick={handleIncrement}
              className={`relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-slate-50 border-[12px] md:border-[16px] shadow-2xl flex items-center justify-center group active:scale-90 transition-all duration-100 cursor-pointer overflow-hidden ${milestoneReached ? 'border-amber-100' : 'border-white'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-active:opacity-10 transition-opacity ${milestoneReached ? 'bg-amber-500' : 'bg-emerald-600'}`}></div>
              
              <div className="flex flex-col items-center gap-4 md:gap-6">
                <div className={`p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-xl transition-all duration-300 ${milestoneReached ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'}`}>
                  <Fingerprint className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
                </div>
                <span className={`font-black uppercase tracking-[0.3em] text-[10px] md:text-xs transition-transform group-hover:scale-110 ${milestoneReached ? 'text-amber-600' : 'text-emerald-600'}`}>
                  Ketuk Disini
                </span>
              </div>
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="mt-12 md:mt-16 flex items-center gap-3 px-8 py-4 bg-rose-50 text-rose-600 rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 group shadow-md"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-[-120deg] transition-transform" />
              Reset Hitungan
            </button>
          </div>
        </div>
      </main>

      {/* MODAL RESET */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center px-4 pb-6 md:pb-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-sm md:max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in duration-300 border border-slate-100">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 text-rose-500 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-inner">
              <RotateCcw className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 text-center mb-2 uppercase tracking-tight">Hapus Progres?</h3>
            <p className="text-slate-500 text-center text-sm md:text-base font-medium mb-8 leading-relaxed">
              Semua hitungan dzikir Anda akan kembali ke nol.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={resetCount}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg shadow-rose-200 active:scale-95 transition-all"
              >
                Ya, Reset Sekarang
              </button>
              <button 
                onClick={() => setShowResetModal(false)}
                className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest active:scale-95 transition-all"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}