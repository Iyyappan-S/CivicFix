require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log("Connecting to the database...");

    // Parse the Aiven credentials for a direct connection
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false },
        multipleStatements: true // This allows running full scripts
    });

    try {
        console.log("Creating database 'defaultdb' if it doesn't exist just in case...");
        // In Aiven, default db is defaultdb. If DB_NAME is different, we can try to create it.
        const dbName = process.env.DB_NAME || 'defaultdb';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.query(`USE \`${dbName}\`;`);

        console.log("Loading schema.sql...");
        let schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
        // Remove the hardcoded USE civicfix since we handled it above
        schemaSql = schemaSql.replace(/CREATE DATABASE IF NOT EXISTS civicfix;/gi, '');
        schemaSql = schemaSql.replace(/USE civicfix;/gi, '');

        await connection.query(schemaSql);
        console.log("✅ Tables created successfully!");

        console.log("Loading seed.sql...");
        let seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');
        seedSql = seedSql.replace(/USE civicfix;/gi, '');

        await connection.query(seedSql);
        console.log("✅ Seed data inserted successfully!");

    } catch (error) {
        console.error("❌ Error setting up database:", error.message);
    } finally {
        await connection.end();
        console.log("Database setup complete.");
        process.exit();
    }
}

setupDatabase();
