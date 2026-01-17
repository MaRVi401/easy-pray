// src/api/quran.js
const BASE_URL = "https://equran.id/api/v2";

// Fungsi untuk mengambil semua daftar surah
export const getSurahList = async () => {
  const response = await fetch(`${BASE_URL}/surat`);
  const data = await response.json();
  return data.data;
};

// Fungsi untuk mengambil isi surah tertentu
export const getSurahDetail = async (nomor) => {
  const response = await fetch(`${BASE_URL}/surat/${nomor}`);
  const data = await response.json();
  return data.data;
};

// Fungsi untuk mengambil tafsir surah tertentu
export const getSurahTafsir = async (nomor) => {
  try {
    const response = await fetch(`${BASE_URL}/tafsir/${nomor}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Gagal mengambil Tafsir:", error);
    return null;
  }
};