# Momentum Association - web

Statický web pro GitHub Pages. Žádný build, žádný server, stačí nahrát soubory.

## Struktura

- `/` `about/` `opportunities/` `projects/` `completed-projects/` `partners/` `contact/` - hlavní stránky
- `opportunities/<slug>/index.html` - stránka jedné příležitosti
- `projects/<slug>/index.html` - stránka jednoho projektu (i dokončeného)
- `css/style.css` - jediný soubor se vzhledem
- `js/main.js` - menu, patička, výpisy a detailní stránky
- `js/data.js` - **sem se přidává obsah** (příležitosti a projekty)
- `images/` - loga a fotky, `reports/` - PDF reporty a infopacky
- `_template` složky - šablony, GitHub je nezveřejňuje

## Přidání příležitosti (např. white-rainbow)

1. Zkopíruj složku `opportunities/_template` a přejmenuj kopii na `white-rainbow`.
2. V `js/data.js` přidej záznam do `opportunities` se `slug:"white-rainbow"` (vzor je v komentáři).
3. Fotky nahraj do `images/opportunities/white-rainbow/`, infopack do `reports/`.
4. Nahraj změny na GitHub. Stránka bude na `/opportunities/white-rainbow/` a objeví se i ve výpisu.

## Přidání projektu (např. digital-grit)

1. Zkopíruj `projects/_template` a přejmenuj na `digital-grit`.
2. V `js/data.js` přidej záznam do `projects`. `status:"ongoing"` ho zobrazí v Projektech, `status:"completed"` v Dokončených projektech (adresa se nemění).
3. Fotky do `images/projects/digital-grit/`, PDF report do `reports/` a cesty uveď v `photos` a `report`.

Texty se píší česky (`cs`) i anglicky (`en`). Pole `requirements` a `covered` jsou seznamy odrážek.

## Vlastní doména momentumassociation.cz

Soubor `CNAME` je připravený. V GitHubu: Settings, Pages, zdroj větev `main`, vlastní doména `momentumassociation.cz`, zapnout Enforce HTTPS. U registrátora domény nastav DNS podle aktuální dokumentace GitHubu ("Managing a custom domain for your GitHub Pages site").

## Náhled u sebe

Web používá adresy od kořene (`/css/style.css`, `/about/` ...), proto ho neotvírej dvojklikem. V terminálu ve složce webu spusť `python3 -m http.server` a otevři `http://localhost:8000/`.

## Když se po nahrání nic nezměnilo

- `index.html` musí ležet přímo v kořeni repozitáře, ne uvnitř složky `momentum-website`.
- Po nahrání počkej minutu až dvě a obnov stránku natvrdo (Cmd+Shift+R).
- Menu a patička jsou přímo v každé stránce, nezávisí na JavaScriptu.

## Ochrana osobních údajů

`privacy/index.html` obsahuje žlutě označená místa `[DOPLNIT]` a `[POTVRDIT]`. Před spoléháním na stránku je vyplň nebo smaž (třída `todo` v textu). Web nenačítá nic z externích serverů, proto nemá cookie lištu.

## Vzhled (design v3)

Celý vzhled je v `css/style.css`, menu a patička jsou statické HTML v každé stránce. Hero animace na úvodní stránce je inline SVG řízené jen CSS a respektuje `prefers-reduced-motion`. Příležitosti a projekty se zobrazují jako karty (plakát nebo fotka, název, termín); detail příležitosti má informace vlevo a plakát vpravo. Obsah se dál přidává jen v `js/data.js`.
