/* NusaStat router: hash routes, shared page state, ticker and mobile nav.
   Routes: #/ overview, #/population, #/economy, #/employment, #/education,
   #/health, #/provinces, #/methodology. */

var NusaState = {
  year: 2024,
  econChart: "bar",
  gdpUnit: "nominal",
  provQuery: "",
  island: "",
  sortKey: "pop",
  sortDir: -1,
};

var ROUTES = {
  "": renderOverview,
  "population": renderPopulation,
  "economy": renderEconomy,
  "employment": renderEmployment,
  "education": renderEducation,
  "health": renderHealth,
  "provinces": renderProvinces,
  "methodology": renderMethodology,
};

function renderTicker() {
  const t = document.getElementById("ticker");
  t.innerHTML = "<strong>2024</strong>" +
    "<span>Penduduk <b>281,6 jt</b></span>" +
    "<span>Ekonomi <b>+5,03%</b></span>" +
    "<span>Inflasi <b>1,57%</b></span>" +
    "<span>Pengangguran <b>4,91%</b></span>" +
    "<span>Kemiskinan <b>8,57%</b></span>" +
    "<span>Ekspor <b>US$264,7 M</b></span>" +
    "<span class=\"ticker-src\">Sumber: BPS</span>";
}

function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const name = hash.split("/")[0];
  const fn = ROUTES[name] || renderOverview;
  fn();
  document.querySelectorAll("#mainNav a").forEach(function (a) {
    a.classList.toggle("active", a.dataset.route === (ROUTES[name] ? name : ""));
  });
  document.getElementById("mainNav").classList.remove("open");
  document.getElementById("navToggle").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}

document.getElementById("navToggle").addEventListener("click", function () {
  const nav = document.getElementById("mainNav");
  const open = nav.classList.toggle("open");
  this.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", route);
renderTicker();
route();
