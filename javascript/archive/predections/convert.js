const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv')

dotenv.config()

const data = JSON.parse(fs.readFileSync("../future_ufo_predictions.json", "utf8"));

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const connection = mysql.createPool(dbConfig);

const create = async () => {
    for (const row of data) {
        const query = `
            INSERT INTO future_ufo_predictions
                (datetime, latitude, longitude, duration, witnesses, colors, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            row.datetime,
            row.latitude ?? null,
            row.longitude ?? null,
            row.duration ?? null,
            row.witnesses ?? null,
            row.colors ?? null,
            row.notes ?? null
        ];

        await connection.execute(query, values);
    }
}

create();

console.log(`✅ Indsat ${data.length} rækker i databasen.`);

