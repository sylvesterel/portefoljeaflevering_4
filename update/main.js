const dotenv = require('dotenv') // Til at lave en .env fil, så vi kan have lokale variabler.
const mysql = require('mysql2/promise') // Til at importere data fra fra en MySQL database. Vi bruger promise for at kunne udnytte asynkronitet til flere MySQL kald.
const path = require('path') // Path som indbygget node.js modul, så vi kan lave en statisk public mappe til HTML filer.
const express = require('express')

dotenv.config(); // configure vores .env fil

const app = express();
const port = 8080;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.use(express.static(path.join(process.cwd(), "public")));

app.put("/update", async (req, res) => {
    const update = await pool.execute(`UPDATE observations
                                       SET location = "4720 Præstø"
                                       WHERE id = 4356`)
    res.send(update)
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
/*
async function updateTable() {
    const  update = await pool.execute('UPDATE observations SET location = "4720 Præstø" WHERE id = 4356')
};

updateTable();
 */