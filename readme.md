# Web & Data – Porteføljeaflevering 4

## Information
Oprindeligt blev data hentet direkte fra en MySQL-server (egen) med dotenv libary og en express server i projektet. For at forenkle aflevering og gøre det nemmere at tilgå og teste projektet senere, har vi ændret til at bruge en lokal JSON-fil som datakilde.

Den oprindelige server.js med Express og tilhørende middleware findes stadig i projektmappen til reference.

---

## AI-Disclaimer
Store dele af **styling** og enkelte elementer af **HTML-strukturen** er lavet med assistance fra AI/ChatGPT, da vores fokus har været **funktionalitet, databehandling og JavaScript**.  
Alt arbejde i JavaScript-filerne er **udført manuelt**.

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
        └─ main.js # Script til at rette eller opdatere fejl data
```