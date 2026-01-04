// src/api/quran.js
const BASE_URL = "https://equran.id/api/v2";

export const getAllSurah = async () => {
  try {
    const response = await fetch(`${BASE_URL}/surat`);
    const data = await response.json();
    return data.data; // Mengembalikan array daftar surah
  } catch (error) {
    console.error("Gagal mengambil data Quran:", error);
    return [];
  }
};