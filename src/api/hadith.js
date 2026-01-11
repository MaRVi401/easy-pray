// marvi401/easy-pray/easy-pray-c3d47f6621f1641f0eaf16914c742df53a7f8598/src/api/hadith.js
const BASE_URL = "https://api.hadith.gading.dev";

export const getHadithBooks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/books`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Gagal ambil buku:", error);
    return [];
  }
};

export const getHadithList = async (id, range = "1-20") => {
  try {
    // Pastikan ID perawi selalu huruf kecil agar API merespon
    const cleanId = id.toLowerCase();
    const response = await fetch(`${BASE_URL}/books/${cleanId}?range=${range}`);
    
    if (!response.ok) throw new Error("Hadits tidak ditemukan");

    const result = await response.json();
    return result.data; 
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
};