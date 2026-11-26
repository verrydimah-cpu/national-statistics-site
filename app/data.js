/* NusaStat data: figures summarised from official BPS (Badan Pusat Statistik)
   publications. Every figure carries its reference year; values are rounded to
   the precision BPS publishes. Years 2020-2024. */

const NUSA = {
  meta: {
    country: "Indonesia",
    source: "Badan Pusat Statistik (BPS)",
    updated: "November 2026",
  },

  /* National time series, 2020-2024 */
  years: [2020, 2021, 2022, 2023, 2024],

  population: { /* millions of people, BPS mid-year estimates */
    label: "Jumlah penduduk",
    unit: "juta jiwa",
    values: [270.2, 272.7, 275.8, 278.7, 281.6],
    note: "Estimasi penduduk pertengahan tahun, BPS.",
  },
  gdpGrowth: { /* percent year-on-year */
    label: "Pertumbuhan PDB",
    unit: "% (y-on-y)",
    values: [-2.07, 3.70, 5.31, 5.05, 5.03],
    note: "Pertumbuhan ekonomi (PDB harga konstan), BPS.",
  },
  gdpNominal: { /* Rp trillion */
    label: "PDB harga berlaku",
    unit: "Rp triliun",
    values: [15443, 16977, 19588, 20892, 22139],
    note: "PDB atas dasar harga berlaku, BPS.",
  },
  gdpPerCapita: { /* Rp million */
    label: "PDB per kapita",
    unit: "Rp juta",
    values: [57.3, 62.2, 71.0, 75.0, 78.6],
    note: "PDB per kapita atas dasar harga berlaku, BPS.",
  },
  inflation: { /* percent, December y-on-y */
    label: "Inflasi (Desember, y-on-y)",
    unit: "%",
    values: [1.68, 1.87, 5.51, 2.61, 1.57],
    note: "Inflasi Desember terhadap Desember tahun sebelumnya, BPS.",
  },
  unemployment: { /* percent, August */
    label: "Tingkat pengangguran terbuka",
    unit: "% (Agustus)",
    values: [7.07, 6.49, 5.86, 5.32, 4.91],
    note: "TPT Agustus, Survei Angkatan Kerja Nasional, BPS.",
  },
  poverty: { /* percent, September */
    label: "Penduduk miskin",
    unit: "% (September)",
    values: [10.19, 9.71, 9.57, 9.36, 8.57],
    note: "Persentase penduduk miskin, September, BPS.",
  },
  exports: { /* US$ billion */
    label: "Nilai ekspor",
    unit: "US$ miliar",
    values: [163.2, 231.6, 291.9, 258.8, 264.7],
    note: "Ekspor barang (FOB), BPS.",
  },
  imports: { /* US$ billion */
    label: "Nilai impor",
    unit: "US$ miliar",
    values: [141.6, 196.2, 237.4, 221.9, 233.7],
    note: "Impor barang (CIF), BPS.",
  },

  /* 2024 snapshot KPIs shown on the dashboard */
  kpi2024: [
    { key: "population", value: "281,6 jt", label: "Penduduk", year: 2024, change: "+1,0% dari 2023" },
    { key: "gdpGrowth", value: "5,03%", label: "Pertumbuhan ekonomi", year: 2024, change: "PDB Rp22.139 triliun" },
    { key: "inflation", value: "1,57%", label: "Inflasi", year: 2024, change: "terendah sejak 2020" },
    { key: "unemployment", value: "4,91%", label: "Pengangguran terbuka", year: 2024, change: "turun dari 5,32% (2023)" },
    { key: "poverty", value: "8,57%", label: "Penduduk miskin", year: 2024, change: "24,06 juta jiwa" },
    { key: "exports", value: "US$264,7 M", label: "Ekspor", year: 2024, change: "surplus US$31,0 M" },
  ],

  ageStructure2024: [
    { group: "0–14 tahun", share: 24.5 },
    { group: "15–64 tahun", share: 68.7 },
    { group: "65+ tahun", share: 6.8 },
  ],

  employmentSectors2024: [
    { sector: "Pertanian, kehutanan, perikanan", share: 28.2 },
    { sector: "Perdagangan", share: 19.1 },
    { sector: "Industri pengolahan", share: 13.8 },
    { sector: "Jasa kemasyarakatan & lainnya", share: 17.6 },
    { sector: "Konstruksi", share: 8.0 },
    { sector: "Transportasi & pergudangan", share: 5.2 },
    { sector: "Lainnya", share: 8.1 },
  ],

  education2024: [
    { key: "literacy", value: "97,9%", label: "Angka melek huruf (15+)", year: 2023 },
    { key: "schooling", value: "9,0 thn", label: "Rata-rata lama sekolah", year: 2024 },
    { key: "expectedSchooling", value: "13,2 thn", label: "Harapan lama sekolah", year: 2024 },
    { key: "primary", value: "99,3%", label: "Partisipasi sekolah SD (7–12 thn)", year: 2023 },
    { key: "secondary", value: "92,4%", label: "Partisipasi sekolah SMP (13–15 thn)", year: 2023 },
    { key: "tertiary", value: "31,7%", label: "Partisipasi pendidikan tinggi (19–23 thn)", year: 2023 },
  ],

  health2024: [
    { key: "lifeExpectancy", value: "74,2 thn", label: "Angka harapan hidup", year: 2024 },
    { key: "infantMortality", value: "16", label: "Kematian bayi per 1.000 kelahiran hidup", year: 2023 },
    { key: "stunting", value: "19,8%", label: "Prevalensi stunting balita", year: 2024 },
    { key: "immunisation", value: "93,8%", label: "Imunisasi dasar lengkap balita", year: 2023 },
    { key: "healthSpending", value: "Rp 188 T", label: "Belanja kesehatan pemerintah", year: 2024 },
    { key: "hospitals", value: "3.193", label: "Rumah sakit di seluruh Indonesia", year: 2024 },
  ],

  /* Provinces: population 2024 (millions), poverty Sep 2024 (%), unemployment Aug 2024 (%) */
  provinces: [
    { name: "Jawa Barat", pop: 49.9, poverty: 7.5, unemp: 6.9, island: "Jawa" },
    { name: "Jawa Timur", pop: 41.8, poverty: 10.4, unemp: 4.1, island: "Jawa" },
    { name: "Jawa Tengah", pop: 37.9, poverty: 10.5, unemp: 4.5, island: "Jawa" },
    { name: "Sumatera Utara", pop: 15.6, poverty: 8.2, unemp: 5.6, island: "Sumatera" },
    { name: "Banten", pop: 12.4, poverty: 5.6, unemp: 7.0, island: "Jawa" },
    { name: "DKI Jakarta", pop: 10.6, poverty: 4.1, unemp: 6.2, island: "Jawa" },
    { name: "Sulawesi Selatan", pop: 9.4, poverty: 8.5, unemp: 4.4, island: "Sulawesi" },
    { name: "Lampung", pop: 9.3, poverty: 11.3, unemp: 4.0, island: "Sumatera" },
    { name: "Sumatera Selatan", pop: 8.8, poverty: 11.9, unemp: 3.9, island: "Sumatera" },
    { name: "Riau", pop: 7.0, poverty: 6.7, unemp: 4.3, island: "Sumatera" },
    { name: "Sumatera Barat", pop: 5.8, poverty: 5.8, unemp: 5.3, island: "Sumatera" },
    { name: "Kalimantan Barat", pop: 5.7, poverty: 6.8, unemp: 4.5, island: "Kalimantan" },
    { name: "Nusa Tenggara Timur", pop: 5.7, poverty: 19.5, unemp: 3.0, island: "Nusa Tenggara" },
    { name: "Kalimantan Timur", pop: 4.0, poverty: 6.0, unemp: 5.2, island: "Kalimantan" },
    { name: "Aceh", pop: 5.5, poverty: 14.2, unemp: 5.6, island: "Sumatera" },
    { name: "Kalimantan Selatan", pop: 4.2, poverty: 4.4, unemp: 3.8, island: "Kalimantan" },
    { name: "Sulawesi Tengah", pop: 3.1, poverty: 12.2, unemp: 2.9, island: "Sulawesi" },
    { name: "Sulawesi Utara", pop: 2.8, poverty: 7.1, unemp: 6.0, island: "Sulawesi" },
    { name: "Bali", pop: 4.4, poverty: 3.8, unemp: 2.4, island: "Bali" },
    { name: "Papua Selatan", pop: 0.6, poverty: 21.5, unemp: 3.4, island: "Papua" },
    { name: "Papua", pop: 1.1, poverty: 24.8, unemp: 3.9, island: "Papua" },
    { name: "Papua Pegunungan", pop: 1.5, poverty: 33.6, unemp: 2.6, island: "Papua" },
    { name: "Maluku", pop: 2.0, poverty: 16.4, unemp: 5.6, island: "Maluku" },
    { name: "DI Yogyakarta", pop: 3.8, poverty: 10.8, unemp: 3.7, island: "Jawa" },
    { name: "Jambi", pop: 3.7, poverty: 7.6, unemp: 4.6, island: "Sumatera" },
    { name: "Nusa Tenggara Barat", pop: 5.6, poverty: 12.8, unemp: 2.9, island: "Nusa Tenggara" },
    { name: "Kalimantan Tengah", pop: 2.8, poverty: 5.1, unemp: 3.3, island: "Kalimantan" },
    { name: "Sulawesi Tenggara", pop: 2.8, poverty: 10.9, unemp: 3.2, island: "Sulawesi" },
    { name: "Bengkulu", pop: 2.1, poverty: 12.7, unemp: 3.2, island: "Sumatera" },
    { name: "Gorontalo", pop: 1.3, poverty: 15.0, unemp: 3.9, island: "Sulawesi" },
    { name: "Sulawesi Barat", pop: 1.6, poverty: 11.2, unemp: 2.6, island: "Sulawesi" },
    { name: "Kepulauan Riau", pop: 2.2, poverty: 5.3, unemp: 6.0, island: "Sumatera" },
    { name: "Kalimantan Utara", pop: 0.7, poverty: 6.6, unemp: 4.6, island: "Kalimantan" },
    { name: "Maluku Utara", pop: 1.4, poverty: 6.4, unemp: 4.1, island: "Maluku" },
    { name: "Papua Barat", pop: 0.6, poverty: 20.8, unemp: 5.0, island: "Papua" },
    { name: "Papua Barat Daya", pop: 0.6, poverty: 17.5, unemp: 5.8, island: "Papua" },
    { name: "Papua Tengah", pop: 1.3, poverty: 29.6, unemp: 4.3, island: "Papua" },
  ],

  highlights: [
    { title: "Penduduk terbanyak", text: "Jawa Barat menjadi provinsi terpadat dengan 49,9 juta jiwa (2024) — sekitar 17,7% dari seluruh penduduk Indonesia." },
    { title: "Ekonomi tumbuh stabil", text: "Ekonomi tumbuh 5,03% pada 2024, melanjutkan tren di atas 5% sejak 2022, ditopang konsumsi rumah tangga dan investasi." },
    { title: "Kemiskinan terendah satu dekade", text: "Tingkat kemiskinan turun ke 8,57% pada September 2024, terendah sejak 2020." },
    { title: "Inflasi terkendali", text: "Inflasi Desember 2024 tercatat 1,57% (y-on-y), terendah dalam lima tahun terakhir." },
  ],
};
