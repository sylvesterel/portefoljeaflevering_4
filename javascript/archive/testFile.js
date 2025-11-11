const fs = require('fs');
const dotenv = require('dotenv') // Til at lave en .env fil, så vi kan have lokale variabler.
const mysql = require('mysql2/promise') // Til at importere data fra fra en MySQL database. Vi bruger promise for at kunne udnytte asynkronitet til flere MySQL kald.

dotenv.config(); // configure vores .env fil

let listOfObservations = {};
let listOfPostalCodes = {};

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

async function fetchDataToList() {
    const data = fs.readFileSync('public/postcode.json');
    listOfPostalCodes = JSON.parse(data);
    [listOfObservations] = await pool.execute('SELECT * FROM observations')
    return true;
}

// 3. Tegn kommuner med tydelige kanter
async function addMunicipalities() {
    await fetchDataToList();

    const obsPrMunicipaliti = {};

    listOfObservations.forEach(obs => {
        const locationArray = obs.location.split(" ")
        const postcode = locationArray[0]
        for (const data of listOfPostalCodes) {
            if (data.nr === postcode) {
                for (const municipaliti of data.kommuner) {
                    if (!obsPrMunicipaliti[municipaliti.navn]) {
                        obsPrMunicipaliti[municipaliti.navn] = 0;
                    }
                    obsPrMunicipaliti[municipaliti.navn]++;
                }
            }
        }
    })
    console.log(obsPrMunicipaliti)
}

addMunicipalities();
