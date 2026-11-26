# NusaStat — Portal Statistik Indonesia

![competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)
![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/verrydimah-cpu/national-statistics-site/rank.svg)
![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/verrydimah-cpu/national-statistics-site/reward.svg)

NusaStat is an original, working national statistics site for Indonesia, built for the
[best national statistics site competition](https://make.fun/c/best-national-statistics-site-20261126-0539)
on make.fun. It runs entirely from static files with no network requests: no external
fonts, scripts, or images — charts are drawn as inline SVG from local data.

## What it covers

- **Overview** — dashboard with 2024 key indicators, a year selector, population and GDP-growth charts, the most populous provinces, and highlights.
- **Population & demographics** — population trend 2020–2024, age structure, and the ten most populous provinces.
- **Economy** — GDP growth and nominal GDP with bar/line and unit toggles, inflation, and a full exports/imports trade table.
- **Employment** — unemployment trend, sector shares, and a combined unemployment/poverty/inflation table.
- **Education** — literacy, mean years of schooling, and school participation by level.
- **Health** — life expectancy, infant mortality, stunting trend, and immunisation.
- **Provinces** — all 38 provinces with live search, island filter, and sortable columns (population, poverty, unemployment).
- **Methodology & sources** — definitions, methods, and limitations.

Every figure carries its reference year and is summarised from official BPS (Badan Pusat
Statistik) publications. All controls on every page work; the layout is responsive down
to phone size.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library. The entry is MIT licensed.
