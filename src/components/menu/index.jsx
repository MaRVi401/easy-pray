import { BookOpen, BookText, Clock, Navigation, Heart, Fingerprint } from 'lucide-react';

export const menus = [
  {
    title: "Al-Qur'an",
    desc: "Baca dan dengarkan murottal",
    icon: <BookOpen className="w-7 h-7" />,
    path: "/quran",
    color: "bg-blue-500"
  },
  {
    title: "Hadits",
    desc: "Cari ribuan hadits shahih",
    icon: <BookText className="w-7 h-7" />,
    path: "/hadits",
    color: "bg-amber-500"
  },
  {
    title: "Jadwal Sholat",
    desc: "Waktu sholat sesuai lokasi",
    icon: <Clock className="w-7 h-7" />,
    path: "/jadwal-sholat",
    color: "bg-emerald-500"
  },
  {
    title: "Dzikir",
    desc: "Permudah dzikir harianmu",
    icon: <Fingerprint className="w-7 h-7" />,
    path: "/dzikir",
    color: "bg-teal-600"
  },
  {
    title: "Arah Kiblat",
    desc: "Cari arah ka'bah presisi",
    icon: <Navigation className="w-7 h-7 rotate-45" />,
    path: "/kiblat",
    color: "bg-indigo-500"
  },
  {
    title: "Doa Harian",
    desc: "Kumpulan doa sehari-hari",
    icon: <Heart className="w-7 h-7" />,
    path: "/doa",
    color: "bg-rose-500"
  },
];