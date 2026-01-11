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

export const getHadithList = async (id, range = "1-50") => {
  try {
    console.log(`Sedang mengambil hadits untuk: ${id}...`); // Debugging
    const response = await fetch(`${BASE_URL}/books/${id}?range=${range}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Data berhasil diterima:", result); // Debugging
    
    // Pastikan kita mengembalikan property 'data' sesuai struktur API Gading
    return result.data; 
  } catch (error) {
    console.error("Fetch Error Detail:", error); // Lihat error detail di Console (F12)
    return null;
  }
};