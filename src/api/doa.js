// src/api/doa.js
const BASE_URL = "https://equran.id/api/doa";

export const getDoaList = async () => {
  try {
    const response = await fetch(BASE_URL);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching doa list:", error);
    return [];
  }
};

// PERBAIKAN DI SINI:
export const getDoaDetail = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const result = await response.json();
    // API EQuran.id untuk detail doa mengembalikan objek langsung di properti .data
    return result.data; 
  } catch (error) {
    console.error("Error fetching doa detail:", error);
    return null;
  }
};