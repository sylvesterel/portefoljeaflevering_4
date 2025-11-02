const dotenv = require('dotenv')
const mysql = require('mysql2/promise')
const express = require('express')
const path = require('path')

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);
const app = express();
const port = 8080;

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/get-obs", async (req, res) => {
    //const by = req.params.by
    //const sqlLikeBy = `%${by}%`
    //const [rows] = await pool.execute('SELECT * FROM observations WHERE location like ?', [sqlLikeBy])
    const [rows] = await pool.execute('SELECT * FROM observations')
    res.send(rows)
})

app.listen(port, () => {
    console.log(`Lytter til port ${port}`)
});