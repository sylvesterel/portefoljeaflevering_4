const dotenv = require('dotenv') // Til at lave en .env fil, så vi kan have lokale variabler.
const mysql = require('mysql2/promise') // Til at importere data fra fra en MySQL database. Vi bruger promise for at kunne udnytte asynkronitet til flere MySQL kald.
const express = require('express') // Express til at lave en lokal app
const path = require('path') // Path som indbygget node.js modul, så vi kan lave en statisk public mappe til HTML filer.

dotenv.config(); // configure vores .env fil

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const app = express();
const port = 8080;

/*  -----------

    Forklaring af Express.static og path.join(process.cwd)
     1. Kombinationen er path.join og process.cwd returnere hvilken mappe som vores fil/express app kører fra.
     2. express.static laver et middelware hvor filer er tilgængelige igennem HTTP.
     I dette tilfælde bruger vi mappen "public", som vores offentlig tilgængelige mappe via HTTP.

    ----------- */

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/get-obs", async (req, res) => {
    const [rows] = await pool.execute('SELECT * FROM observations')
    res.send(rows)
})

app.listen(port, () => {
    console.log(`Lytter til port ${port}`)
});