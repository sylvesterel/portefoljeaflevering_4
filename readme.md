# Web & Data – Porteføljeaflevering 4

## Gruppe
Sylvester, Oscar, Christoffer

---

## AI-Disclaimer
Store dele af **styling** og enkelte elementer af **HTML-strukturen** er lavet med assistance fra AI, da vores fokus har været **funktionalitet, databehandling og JavaScript-logik**.  
Alt arbejde i JavaScript-filerne er **udført og forstået manuelt** af udviklerne.

---

## Projektstruktur

```Javascript
│
├─ index.js # Konfiguration af Leaflet – opsætning af kort og lag
├─ chart.js # Konfiguration af Chart.js – opbygning af grafer og datahåndtering
│
└─ archive
│
├─ server.js # Original server – henter data fra MySQL
├─ testFile.js # Midlertidig testfil til at forstå Leaflet og interne endpoints
│
├─ predictions
│ └─ convert.js # Konverterer AI-genereret fremtidsdata til MySQL-format
│
└─ update
└─ main.js # Script til at rette eller opdatere fejlbehæftede data
```