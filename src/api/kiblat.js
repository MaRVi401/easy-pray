// src/api/kiblat.js
export const getQiblaDirection = async (lat, lng) => {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/qibla/${lat}/${lng}`);
    const result = await response.json();
    return result.data.direction;
  } catch (error) {
    console.error("Gagal mengambil arah kiblat:", error);
    return null;
  }
};