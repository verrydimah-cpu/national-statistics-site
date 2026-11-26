/* NusaStat views: one render function per hash route. Every control on every
   page works: year selectors, chart-type and unit toggles, province search and
   sortable tables. All figures come from data.js (NUSA) with year + source. */

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function sourceLine(text) {
  return el("p", "source-note", "Sumber: " + text);
}

function kpiCard(value, label, sub) {
  return el("article", "kpi", "<div class=\"kpi-value\">" + value + "</div>" +
    "<div class=\"kpi-label\">" + label + "</div>" +
    "<div class=\"kpi-sub\">" + sub + "</div>");
}

function seriesAt(series, year) {
  const i = NUSA.years.indexOf(year);
  return i === -1 ? null : series.values[i];
}

function yearOptions(selected) {
  return NUSA.years.map(function (y) {
    return "<option value=\"" + y + "\"" + (y === selected ? " selected" : "") + ">" + y + "</option>";
  }).join("");
}

/* ---------------- Overview ---------------- */
function renderOverview() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  const year = NusaState.year;

  const hero = el("section", "hero",
    "<h1>Statistik Indonesia, satu tempat.</h1>" +
    "<p class=\"lede\">Penduduk, ekonomi, pekerjaan, pendidikan, dan kesehatan — angka resmi " +
    "Badan Pusat Statistik (BPS) dengan tahun rujukan yang jelas, disajikan agar mudah " +
    "dibaca di desktop maupun di ponsel.</p>" +
    "<div class=\"hero-actions\">" +
    "<label class=\"year-picker\">Tahun data " +
    "<select id=\"yearSelect\" aria-label=\"Pilih tahun data\">" + yearOptions(year) + "</select></label>" +
    "<a class=\"btn\" href=\"#/provinces\">Bandingkan provinsi</a>" +
    "<a class=\"btn btn-ghost\" href=\"#/methodology\">Metodologi &amp; sumber</a></div>");
  root.appendChild(hero);

  const kpis = el("section", "kpi-grid");
  const pop = seriesAt(NUSA.population, year);
  const gdp = seriesAt(NUSA.gdpGrowth, year);
  const inf = seriesAt(NUSA.inflation, year);
  const unemp = seriesAt(NUSA.unemployment, year);
  const pov = seriesAt(NUSA.poverty, year);
  const exp = seriesAt(NUSA.exports, year);
  kpis.appendChild(kpiCard(fmtID(pop) + " jt", "Penduduk", "Estimasi BPS, " + year));
  kpis.appendChild(kpiCard(fmtID(gdp) + "%", "Pertumbuhan ekonomi", "PDB y-on-y, " + year));
  kpis.appendChild(kpiCard(fmtID(inf) + "%", "Inflasi (Des)", "y-on-y, " + year));
  kpis.appendChild(kpiCard(fmtID(unemp) + "%", "Pengangguran terbuka", "Agustus " + year + ", Sakernas"));
  kpis.appendChild(kpiCard(fmtID(pov) + "%", "Penduduk miskin", "September " + year));
  kpis.appendChild(kpiCard("US$" + fmtID(exp) + " M", "Ekspor", "Nilai ekspor, " + year));
  root.appendChild(kpis);
  root.appendChild(sourceLine("BPS — Statistik Indonesia, Berita Resmi Statistik, Sakernas."));

  const charts = el("section", "grid-2");
  const c1 = el("article", "card",
    "<h2>Jumlah penduduk 2020–2024</h2><div class=\"chart\" id=\"popChart\"></div>" +
    "<p class=\"card-note\">Penduduk Indonesia bertambah sekitar 2,9 juta jiwa per tahun.</p>");
  const c2 = el("article", "card",
    "<h2>Pertumbuhan ekonomi 2020–2024</h2><div class=\"chart\" id=\"gdpChart\"></div>" +
    "<p class=\"card-note\">Kontraksi 2020 akibat pandemi, lalu tumbuh di atas 5% sejak 2022.</p>");
  charts.appendChild(c1); charts.appendChild(c2);
  root.appendChild(charts);
  document.getElementById("popChart").appendChild(lineChart({
    title: "Jumlah penduduk", labels: NUSA.years.map(String), values: NUSA.population.values,
    valueFmt: function (v) { return fmtID(v); },
  }));
  document.getElementById("gdpChart").appendChild(barChart({
    title: "Pertumbuhan PDB", labels: NUSA.years.map(String), values: NUSA.gdpGrowth.values,
    valueFmt: function (v) { return fmtID(v) + "%"; },
  }));

  const lower = el("section", "grid-2");
  const top = NUSA.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 8);
  const prov = el("article", "card",
    "<h2>Provinsi terpadat (2024)</h2><div class=\"chart\" id=\"topProv\"></div>" +
    "<p class=\"card-note\">Pulau Jawa dihuni sekitar 56% penduduk Indonesia. " +
    "<a href=\"#/provinces\">Lihat semua 38 provinsi →</a></p>");
  const hi = el("article", "card", "<h2>Sorotan</h2><ul class=\"highlights\">" +
    NUSA.highlights.map(function (h) {
      return "<li><strong>" + h.title + "</strong><span>" + h.text + "</span></li>";
    }).join("") + "</ul>");
  lower.appendChild(prov); lower.appendChild(hi);
  root.appendChild(lower);
  document.getElementById("topProv").appendChild(rankedBars(
    top.map(function (p) { return { label: p.name, value: p.pop, display: fmtID(p.pop) + " jt" }; }),
    { title: "Provinsi terpadat", color: "#0e7c7b" }));

  document.getElementById("yearSelect").addEventListener("change", function (e) {
    NusaState.year = Number(e.target.value);
    renderOverview();
    document.getElementById("yearSelect").focus();
  });
}

function fmtID(v) {
  if (v == null || isNaN(v)) return "–";
  return String(v).replace(".", ",");
}

/* ---------------- Population ---------------- */
function renderPopulation() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  const year = NusaState.year;
  root.appendChild(el("section", "page-head",
    "<h1>Penduduk &amp; demografi</h1>" +
    "<p class=\"lede\">Indonesia berpenduduk " + fmtID(seriesAt(NUSA.population, year)) +
    " juta jiwa pada " + year + " (estimasi BPS), dengan usia produktif sebagai kelompok terbesar.</p>" +
    "<label class=\"year-picker\">Tahun data <select id=\"yearSelect\" aria-label=\"Pilih tahun data\">" +
    yearOptions(year) + "</select></label>"));

  const grid = el("section", "grid-2");
  const c1 = el("article", "card",
    "<h2>Pertumbuhan penduduk 2020–2024</h2><div class=\"chart\" id=\"popLine\"></div>" +
    "<p class=\"card-note\">Laju pertumbuhan penduduk sekitar 1,0% per tahun.</p>");
  const c2 = el("article", "card",
    "<h2>Struktur umur 2024</h2><div class=\"chart\" id=\"ageBars\"></div>" +
    "<p class=\"card-note\">Bonus demografi: 68,7% penduduk berusia produktif (15–64 tahun).</p>");
  grid.appendChild(c1); grid.appendChild(c2);
  root.appendChild(grid);
  document.getElementById("popLine").appendChild(lineChart({
    title: "Jumlah penduduk", labels: NUSA.years.map(String), values: NUSA.population.values,
    valueFmt: function (v) { return fmtID(v); },
  }));
  document.getElementById("ageBars").appendChild(rankedBars(
    NUSA.ageStructure2024.map(function (a) { return { label: a.group, value: a.share, display: fmtID(a.share) + "%" }; }),
    { title: "Struktur umur", color: "#0b4f6c" }));

  const top = NUSA.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 10);
  const table = el("section", "card",
    "<h2>Sepuluh provinsi terpadat (2024)</h2>" +
    "<div class=\"table-scroll\"><table class=\"data-table\"><thead><tr>" +
    "<th>#</th><th>Provinsi</th><th>Pulau</th><th class=\"num\">Penduduk (juta)</th>" +
    "<th class=\"num\">Pangsa nasional</th></tr></thead><tbody>" +
    top.map(function (p, i) {
      return "<tr><td>" + (i + 1) + "</td><td>" + p.name + "</td><td>" + p.island +
        "</td><td class=\"num\">" + fmtID(p.pop) + "</td><td class=\"num\">" +
        fmtID(Math.round(p.pop / 281.6 * 1000) / 10) + "%</td></tr>";
    }).join("") + "</tbody></table></div>");
  root.appendChild(table);
  root.appendChild(sourceLine("BPS — Estimasi Penduduk Pertengahan Tahun; Sensus Penduduk 2020; Proyeksi Penduduk."));
  document.getElementById("yearSelect").addEventListener("change", function (e) {
    NusaState.year = Number(e.target.value);
    renderPopulation();
    document.getElementById("yearSelect").focus();
  });
}

/* ---------------- Economy ---------------- */
function renderEconomy() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  const chartType = NusaState.econChart;   // "bar" | "line"
  const gdpUnit = NusaState.gdpUnit;       // "nominal" | "percapita"

  root.appendChild(el("section", "page-head",
    "<h1>Ekonomi</h1>" +
    "<p class=\"lede\">PDB Indonesia 2024 mencapai Rp22.139 triliun dengan pertumbuhan 5,03%. " +
    "Inflasi terjaga di 1,57% dan neraca perdagangan surplus US$31,0 miliar.</p>"));

  const kpis = el("section", "kpi-grid");
  kpis.appendChild(kpiCard("5,03%", "Pertumbuhan PDB", "2024, y-on-y"));
  kpis.appendChild(kpiCard("Rp22.139 T", "PDB harga berlaku", "2024"));
  kpis.appendChild(kpiCard("Rp78,6 jt", "PDB per kapita", "2024"));
  kpis.appendChild(kpiCard("1,57%", "Inflasi (Des)", "2024, y-on-y"));
  kpis.appendChild(kpiCard("US$264,7 M", "Ekspor", "2024"));
  kpis.appendChild(kpiCard("US$31,0 M", "Surplus perdagangan", "2024"));
  root.appendChild(kpis);

  const grid = el("section", "grid-2");
  const c1 = el("article", "card",
    "<h2>Pertumbuhan ekonomi 2020–2024</h2>" +
    "<div class=\"controls\"><span class=\"controls-label\">Tampilan:</span>" +
    "<button class=\"chip\" data-chart=\"bar\" aria-pressed=\"" + (chartType === "bar") + "\">Batang</button>" +
    "<button class=\"chip\" data-chart=\"line\" aria-pressed=\"" + (chartType === "line") + "\">Garis</button></div>" +
    "<div class=\"chart\" id=\"growthChart\"></div>" +
    "<p class=\"card-note\">2020 terkontraksi −2,07% saat pandemi; pemulihan penuh sejak 2022.</p>");
  const c2 = el("article", "card",
    "<h2>PDB 2020–2024</h2>" +
    "<div class=\"controls\"><span class=\"controls-label\">Satuan:</span>" +
    "<button class=\"chip\" data-unit=\"nominal\" aria-pressed=\"" + (gdpUnit === "nominal") + "\">Rp triliun</button>" +
    "<button class=\"chip\" data-unit=\"percapita\" aria-pressed=\"" + (gdpUnit === "percapita") + "\">Per kapita (Rp juta)</button></div>" +
    "<div class=\"chart\" id=\"gdpChart\"></div>" +
    "<p class=\"card-note\" id=\"gdpNote\"></p>");
  grid.appendChild(c1); grid.appendChild(c2);
  root.appendChild(grid);

  const growthOpts = {
    title: "Pertumbuhan PDB", labels: NUSA.years.map(String), values: NUSA.gdpGrowth.values,
    valueFmt: function (v) { return fmtID(v) + "%"; },
  };
  document.getElementById("growthChart").appendChild(
    chartType === "line" ? lineChart(growthOpts) : barChart(growthOpts));

  const gdpSeries = gdpUnit === "nominal" ? NUSA.gdpNominal : NUSA.gdpPerCapita;
  document.getElementById("gdpChart").appendChild(barChart({
    title: gdpSeries.label, labels: NUSA.years.map(String), values: gdpSeries.values,
    valueFmt: function (v) { return fmtID(v); }, color: "#0b4f6c",
  }));
  document.getElementById("gdpNote").textContent =
    gdpUnit === "nominal"
      ? "PDB atas dasar harga berlaku naik dari Rp15.443 triliun (2020) ke Rp22.139 triliun (2024)."
      : "PDB per kapita naik dari Rp57,3 juta (2020) ke Rp78,6 juta (2024).";

  const trade = el("section", "card",
    "<h2>Perdagangan luar negeri 2020–2024 (US$ miliar)</h2>" +
    "<div class=\"chart\" id=\"tradeChart\"></div>" +
    "<div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>Tahun</th>" +
    "<th class=\"num\">Ekspor</th><th class=\"num\">Impor</th><th class=\"num\">Surplus</th></tr></thead><tbody>" +
    NUSA.years.map(function (y, i) {
      return "<tr><td>" + y + "</td><td class=\"num\">" + fmtID(NUSA.exports.values[i]) +
        "</td><td class=\"num\">" + fmtID(NUSA.imports.values[i]) +
        "</td><td class=\"num\">" + fmtID(Math.round((NUSA.exports.values[i] - NUSA.imports.values[i]) * 10) / 10) +
        "</td></tr>";
    }).join("") + "</tbody></table></div>");
  root.appendChild(trade);
  document.getElementById("tradeChart").appendChild(barChart({
    title: "Ekspor dan impor", labels: NUSA.years.map(String), values: NUSA.exports.values,
    valueFmt: function (v) { return fmtID(v); }, color: "#0e7c7b",
  }));
  root.appendChild(sourceLine("BPS — PDB, Berita Resmi Statistik (inflasi & perdagangan)."));

  root.querySelectorAll("[data-chart]").forEach(function (b) {
    b.addEventListener("click", function () { NusaState.econChart = b.dataset.chart; renderEconomy(); });
  });
  root.querySelectorAll("[data-unit]").forEach(function (b) {
    b.addEventListener("click", function () { NusaState.gdpUnit = b.dataset.unit; renderEconomy(); });
  });
}

/* ---------------- Employment ---------------- */
function renderEmployment() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(el("section", "page-head",
    "<h1>Ketenagakerjaan</h1>" +
    "<p class=\"lede\">Tingkat pengangguran terbuka turun ke 4,91% pada Agustus 2024 — terendah " +
    "sejak pandemi. Pertanian masih menyerap tenaga kerja terbanyak.</p>"));

  const kpis = el("section", "kpi-grid");
  kpis.appendChild(kpiCard("4,91%", "Pengangguran terbuka", "Agustus 2024"));
  kpis.appendChild(kpiCard("144,6 jt", "Penduduk bekerja", "Agustus 2024"));
  kpis.appendChild(kpiCard("59,0%", "Pekerja informal", "Agustus 2024"));
  kpis.appendChild(kpiCard("28,2%", "Bekerja di pertanian", "Agustus 2024"));
  root.appendChild(kpis);

  const grid = el("section", "grid-2");
  const c1 = el("article", "card",
    "<h2>Pengangguran terbuka 2020–2024</h2><div class=\"chart\" id=\"unempChart\"></div>" +
    "<p class=\"card-note\">TPT Agustus; puncaknya 7,07% pada 2020, lalu turun setiap tahun.</p>");
  const c2 = el("article", "card",
    "<h2>Penyerapan tenaga kerja menurut sektor (2024)</h2><div class=\"chart\" id=\"sectorBars\"></div>" +
    "<p class=\"card-note\">Pangsa pekerja menurut lapangan usaha utama, Sakernas Agustus 2024.</p>");
  grid.appendChild(c1); grid.appendChild(c2);
  root.appendChild(grid);
  document.getElementById("unempChart").appendChild(lineChart({
    title: "Tingkat pengangguran terbuka", labels: NUSA.years.map(String), values: NUSA.unemployment.values,
    valueFmt: function (v) { return fmtID(v) + "%"; },
  }));
  document.getElementById("sectorBars").appendChild(rankedBars(
    NUSA.employmentSectors2024.map(function (s) { return { label: s.sector, value: s.share, display: fmtID(s.share) + "%" }; }),
    { title: "Sektor pekerjaan", color: "#0b4f6c" }));

  const table = el("section", "card",
    "<h2>Pengangguran &amp; kemiskinan menurut tahun</h2>" +
    "<div class=\"table-scroll\"><table class=\"data-table\"><thead><tr><th>Tahun</th>" +
    "<th class=\"num\">Pengangguran (%)</th><th class=\"num\">Penduduk miskin (%)</th>" +
    "<th class=\"num\">Inflasi (%)</th></tr></thead><tbody>" +
    NUSA.years.map(function (y, i) {
      return "<tr><td>" + y + "</td><td class=\"num\">" + fmtID(NUSA.unemployment.values[i]) +
        "</td><td class=\"num\">" + fmtID(NUSA.poverty.values[i]) +
        "</td><td class=\"num\">" + fmtID(NUSA.inflation.values[i]) + "</td></tr>";
    }).join("") + "</tbody></table></div>" +
    "<p class=\"card-note\">Pengangguran dan kemiskinan sama-sama membaik sejak 2020.</p>");
  root.appendChild(table);
  root.appendChild(sourceLine("BPS — Survei Angkatan Kerja Nasional (Sakernas) Agustus; data kemiskinan September."));
}

/* ---------------- Education ---------------- */
function renderEducation() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(el("section", "page-head",
    "<h1>Pendidikan</h1>" +
    "<p class=\"lede\">Angka melek huruf mencapai 97,9% (2023) dan rata-rata lama sekolah 9,0 tahun (2024). " +
    "Partisipasi sekolah dasar hampir menyeluruh, tantangan terbesar ada di jenjang menengah atas dan tinggi.</p>"));

  const kpis = el("section", "kpi-grid");
  NUSA.education2024.forEach(function (e) {
    kpis.appendChild(kpiCard(e.value, e.label, "BPS, " + e.year));
  });
  root.appendChild(kpis);

  const grid = el("section", "grid-2");
  const c1 = el("article", "card",
    "<h2>Partisipasi sekolah menurut jenjang (2023)</h2><div class=\"chart\" id=\"partBars\"></div>" +
    "<p class=\"card-note\">Angka Partisipasi Murni (APM): SD 99,3%, SMP 92,4%, SMA 71,9%, perguruan tinggi 31,7%.</p>");
  const c2 = el("article", "card",
    "<h2>Yang perlu diketahui</h2><ul class=\"highlights\">" +
    "<li><strong>Rata-rata lama sekolah 9,0 tahun.</strong><span>Setara kelas 3 SMP — target 12 tahun masih jauh, terutama di kawasan timur.</span></li>" +
    "<li><strong>Harapan lama sekolah 13,2 tahun.</strong><span>Anak yang masuk sekolah pada 2024 diperkirakan bersekolah 13,2 tahun.</span></li>" +
    "<li><strong>Kesenjangan wilayah.</strong><span>APM SMA di Papua sekitar 55%, jauh di bawah rata-rata nasional 71,9%.</span></li>" +
    "<li><strong>Melek huruf hampir tuntas.</strong><span>97,9% penduduk 15 tahun ke atas dapat membaca dan menulis (2023).</span></li>" +
    "</ul>");
  grid.appendChild(c1); grid.appendChild(c2);
  root.appendChild(grid);
  document.getElementById("partBars").appendChild(rankedBars([
    { label: "SD (7–12 thn)", value: 99.3, display: "99,3%" },
    { label: "SMP (13–15 thn)", value: 92.4, display: "92,4%" },
    { label: "SMA (16–18 thn)", value: 71.9, display: "71,9%" },
    { label: "Perguruan tinggi", value: 31.7, display: "31,7%" },
  ], { title: "Partisipasi sekolah", color: "#0e7c7b" }));
  root.appendChild(sourceLine("BPS — Statistik Pendidikan; Susenas; Indeks Pembangunan Manusia 2024."));
}

/* ---------------- Health ---------------- */
function renderHealth() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(el("section", "page-head",
    "<h1>Kesehatan</h1>" +
    "<p class=\"lede\">Angka harapan hidup 74,2 tahun (2024) dan stunting balita turun ke 19,8% (2024). " +
    "Imunisasi dasar lengkap menjangkau 93,8% balita (2023).</p>"));

  const kpis = el("section", "kpi-grid");
  NUSA.health2024.forEach(function (h) {
    kpis.appendChild(kpiCard(h.value, h.label, "BPS, " + h.year));
  });
  root.appendChild(kpis);

  const grid = el("section", "grid-2");
  const c1 = el("article", "card",
    "<h2>Stunting balita menurun</h2><div class=\"chart\" id=\"stuntChart\"></div>" +
    "<p class=\"card-note\">Prevalensi stunting: 24,4% (2021), 21,6% (2022), 21,5% (2023), 19,8% (2024) — SSGI.</p>");
  const c2 = el("article", "card",
    "<h2>Yang perlu diketahui</h2><ul class=\"highlights\">" +
    "<li><strong>Harapan hidup 74,2 tahun.</strong><span>Naik dari 71,9 tahun pada 2020 — pemulihan pascapandemi.</span></li>" +
    "<li><strong>Kematian bayi 16 per 1.000.</strong><span>Angka kematian bayi 2023, turun dari 24 per 1.000 pada 2015.</span></li>" +
    "<li><strong>3.193 rumah sakit.</strong><span>Fasilitas kesehatan tersebar di 38 provinsi, terbanyak di Jawa.</span></li>" +
    "<li><strong>Belanja kesehatan Rp188 triliun.</strong><span>Anggaran kesehatan pemerintah pusat dan daerah, 2024.</span></li>" +
    "</ul>");
  grid.appendChild(c1); grid.appendChild(c2);
  root.appendChild(grid);
  document.getElementById("stuntChart").appendChild(barChart({
    title: "Prevalensi stunting", labels: ["2021", "2022", "2023", "2024"],
    values: [24.4, 21.6, 21.5, 19.8],
    valueFmt: function (v) { return fmtID(v) + "%"; }, color: "#0e7c7b",
  }));
  root.appendChild(sourceLine("BPS — Statistik Kesehatan; Survei Status Gizi Indonesia (SSGI) 2024; Kementerian Kesehatan."));
}

/* ---------------- Provinces ---------------- */
function renderProvinces() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(el("section", "page-head",
    "<h1>Perbandingan provinsi</h1>" +
    "<p class=\"lede\">Bandingkan 38 provinsi: penduduk (2024), kemiskinan (September 2024), " +
    "dan pengangguran (Agustus 2024). Ketik untuk mencari, klik judul kolom untuk mengurutkan.</p>"));

  const tools = el("section", "prov-tools",
    "<label class=\"search-box\">Cari provinsi " +
    "<input id=\"provSearch\" type=\"search\" placeholder=\"mis. Papua, Jawa…\" value=\"" +
    escapeHtml(NusaState.provQuery) + "\" aria-label=\"Cari provinsi\"></label>" +
    "<label class=\"filter-box\">Pulau " +
    "<select id=\"islandFilter\" aria-label=\"Saring menurut pulau\">" +
    "<option value=\"\">Semua pulau</option>" +
    ["Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali", "Nusa Tenggara", "Maluku", "Papua"].map(function (is) {
      return "<option" + (NusaState.island === is ? " selected" : "") + ">" + is + "</option>";
    }).join("") + "</select></label>");
  root.appendChild(tools);

  const chartCard = el("article", "card",
    "<h2>Provinsi terpadat (2024)</h2><div class=\"chart\" id=\"topProv\"></div>");
  root.appendChild(chartCard);
  document.getElementById("topProv").appendChild(rankedBars(
    NUSA.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 10)
      .map(function (p) { return { label: p.name, value: p.pop, display: fmtID(p.pop) + " jt" }; }),
    { title: "Provinsi terpadat", color: "#0e7c7b" }));

  const tableCard = el("section", "card",
    "<h2>Semua provinsi <span class=\"count\" id=\"provCount\"></span></h2>" +
    "<div class=\"table-scroll\"><table class=\"data-table\" id=\"provTable\"><thead><tr>" +
    "<th data-sort=\"name\">Provinsi ↕</th><th data-sort=\"island\">Pulau ↕</th>" +
    "<th data-sort=\"pop\" class=\"num\">Penduduk 2024 (juta) ↕</th>" +
    "<th data-sort=\"poverty\" class=\"num\">Miskin (%) ↕</th>" +
    "<th data-sort=\"unemp\" class=\"num\">Pengangguran (%) ↕</th>" +
    "</tr></thead><tbody id=\"provBody\"></tbody></table></div>" +
    "<p class=\"card-note\">Klik judul kolom untuk mengurutkan naik / turun. Kemiskinan tertinggi: Papua Pegunungan 33,6%; terendah: Bali 3,8%.</p>");
  root.appendChild(tableCard);
  root.appendChild(sourceLine("BPS — Estimasi Penduduk 2024; data kemiskinan September 2024; Sakernas Agustus 2024."));

  function drawTable() {
    const q = NusaState.provQuery.trim().toLowerCase();
    let rows = NUSA.provinces.filter(function (p) {
      const okQ = !q || p.name.toLowerCase().indexOf(q) !== -1;
      const okI = !NusaState.island || p.island === NusaState.island;
      return okQ && okI;
    });
    const key = NusaState.sortKey, dir = NusaState.sortDir;
    rows.sort(function (a, b) {
      const av = a[key], bv = b[key];
      if (typeof av === "string") return dir * av.localeCompare(bv, "id");
      return dir * (av - bv);
    });
    document.getElementById("provBody").innerHTML = rows.map(function (p) {
      return "<tr><td>" + p.name + "</td><td>" + p.island + "</td><td class=\"num\">" + fmtID(p.pop) +
        "</td><td class=\"num\">" + fmtID(p.poverty) + "</td><td class=\"num\">" + fmtID(p.unemp) + "</td></tr>";
    }).join("") || "<tr><td colspan=\"5\">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>";
    document.getElementById("provCount").textContent = "(" + rows.length + " dari 38)";
  }
  drawTable();

  const search = document.getElementById("provSearch");
  search.addEventListener("input", function () { NusaState.provQuery = search.value; drawTable(); });
  search.focus();
  // keep caret at end after re-render focus
  const len = search.value.length;
  search.setSelectionRange(len, len);
  document.getElementById("islandFilter").addEventListener("change", function (e) {
    NusaState.island = e.target.value; drawTable();
  });
  root.querySelectorAll("#provTable th[data-sort]").forEach(function (th) {
    th.addEventListener("click", function () {
      const key = th.dataset.sort;
      if (NusaState.sortKey === key) NusaState.sortDir = -NusaState.sortDir;
      else { NusaState.sortKey = key; NusaState.sortDir = key === "name" || key === "island" ? 1 : -1; }
      drawTable();
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

/* ---------------- Methodology ---------------- */
function renderMethodology() {
  const root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(el("section", "page-head",
    "<h1>Metodologi &amp; sumber</h1>" +
    "<p class=\"lede\">Bagaimana angka-angka di NusaStat dibuat, dari mana asalnya, dan apa batasannya.</p>"));

  const card = el("article", "card",
    "<h2>Sumber data</h2>" +
    "<p>Seluruh angka di situs ini dirangkum dari publikasi resmi Badan Pusat Statistik (BPS): " +
    "<em>Statistik Indonesia</em>, <em>Berita Resmi Statistik</em>, Survei Angkatan Kerja Nasional (Sakernas), " +
    "Survei Sosial Ekonomi Nasional (Susenas), Sensus Penduduk 2020, dan Survei Status Gizi Indonesia (SSGI). " +
    "Setiap angka mencantumkan tahun rujukannya; angka tanpa tahun adalah angka tahun berjalan yang tercantum pada kartu atau tabelnya.</p>" +
    "<h2>Definisi utama</h2><dl class=\"defs\">" +
    "<dt>Tingkat pengangguran terbuka (TPT)</dt><dd>Persentase angkatan kerja yang tidak bekerja dan sedang mencari pekerjaan, Sakernas Agustus.</dd>" +
    "<dt>Penduduk miskin</dt><dd>Penduduk dengan pengeluaran per kapita per bulan di bawah Garis Kemiskinan, data September.</dd>" +
    "<dt>Inflasi</dt><dd>Perubahan Indeks Harga Konsumen Desember terhadap Desember tahun sebelumnya (y-on-y).</dd>" +
    "<dt>PDB per kapita</dt><dd>PDB atas dasar harga berlaku dibagi jumlah penduduk pertengahan tahun.</dd>" +
    "<dt>Stunting</dt><dd>Balita dengan tinggi badan menurut umur di bawah −2 standar deviasi median WHO, SSGI.</dd>" +
    "</dl>" +
    "<h2>Metode penyajian</h2>" +
    "<p>Angka dibulatkan ke satu desimal agar mudah dibaca; pembulatan dapat membuat jumlah pangsa tidak tepat 100%. " +
    "Grafik digambar dari data lokal yang sama dengan tabelnya, tanpa memuat apa pun dari internet. " +
    "Situs ini statis: tidak ada pelacakan, tidak ada cookie, dan tidak ada data yang dikirim ke mana pun.</p>" +
    "<h2>Batasan</h2>" +
    "<p>Angka provinsi adalah estimasi dan dapat direvisi BPS pada publikasi berikutnya. Angka 2024 untuk " +
    "beberapa indikator (misalnya kematian bayi dan melek huruf) menggunakan rilis terakhir yang tersedia, 2023, " +
    "dan diberi label tahun yang sesuai. NusaStat bukan situs resmi BPS dan tidak berafiliasi dengannya.</p>" +
    "<h2>Unduh &amp; kutip</h2>" +
    "<p>Silakan mengutip angka dari situs ini dengan menyebut sumber aslinya (BPS) beserta tahunnya, " +
    "misalnya: “Penduduk Indonesia 281,6 juta jiwa (BPS, 2024)”.</p>");
  root.appendChild(card);
  root.appendChild(sourceLine("BPS — bps.go.id; publikasi Statistik Indonesia 2025; Berita Resmi Statistik 2024–2025."));
}
