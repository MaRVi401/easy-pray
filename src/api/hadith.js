// src/api/hadith.js
const BASE_URL = "https://api.hadith.gading.dev";

export const getHadithBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/books`);
    const data = await response.json();
    // API Gading membungkus data dalam properti 'data'
    return data.data; 
  } catch (error) {
    console.error("Gagal ambil buku:", error);
    return [];
  }
};

export const getHadithList = async (id, range = "1-20") => {
  try {
    const cleanId = id.toLowerCase();
    const response = await fetch(`${BASE_URL}/books/${cleanId}?range=${range}`);
    
    if (!response.ok) throw new Error("Hadits tidak ditemukan");

    const result = await response.json();
    // Mengembalikan result.data yang berisi { name, id, available, hadiths: [...] }
    return result.data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
};