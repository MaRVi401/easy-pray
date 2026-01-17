// src/api/sholat.js

// API Aladhan bagus untuk konversi Latitude/Longitude ke Jadwal
export const getSholatByCoords = async (lat, lng) => {
  try {
    const date = new Date().getTime() / 1000;
    const response = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=11`); // Method 11 = Kemenag RI
    const result = await response.json();
    return {
      timings: result.data.timings,
      location: result.data.meta.timezone,
      date: result.data.date.readable
    };
  } catch (error) {
    console.error("Error fetching sholat by coords:", error);
    return null;
  }
};

// API MyQuran bagus untuk pencarian kota di Indonesia
export const searchCity = async (query) => {
  try {
    const response = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${query}`);
    const result = await response.json();
    return result.data; // Mengembalikan daftar kota
  } catch (error) {
    return [];
  }
};

export const getSholatByCityId = async (id) => {
  try {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${id}/${y}/${m}/${d}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    return null;
  }
};