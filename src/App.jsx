function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50">
      <div className="text-center p-10 bg-white shadow-2xl rounded-3xl">
        <h1 className="text-4xl font-bold text-emerald-700">EasyPray</h1>
        <p className="mt-4 text-gray-600">Alhamdulillah, Tailwind v4 Berhasil Terpasang!</p>
        <div className="mt-6 flex gap-4 justify-center">
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:shadow-lg transition-all">
            Jadwal Sholat
          </button>
          <button className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 rounded-full hover:bg-emerald-50 transition-all">
            Baca Quran
          </button>
        </div>
      </div>
    </div>
  )
}

export default App