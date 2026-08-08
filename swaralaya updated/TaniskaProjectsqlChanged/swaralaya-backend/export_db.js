const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  const exportDir = path.join(__dirname, 'database_exports');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  // 1. Generate SQL dump
  console.log('Generating SQL dump...');
  try {
    const sqlPath = path.join(exportDir, 'swaralaya_db.sql');
    execSync(`mysqldump -u root swaralaya_db > "${sqlPath}"`);
    console.log(`Saved SQL dump to: ${sqlPath}`);
  } catch (err) {
    console.error('Failed to generate SQL dump via mysqldump:', err.message);
  }

  // 2. Export each table to CSV
  console.log('Connecting to database to export tables to CSV...');
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'swaralaya_db'
    });

    const tables = ['blogs', 'contacts', 'enrollments'];
    for (const table of tables) {
      console.log(`Exporting table: ${table}...`);
      const [rows] = await connection.execute(`SELECT * FROM \`${table}\``);
      
      if (rows.length === 0) {
        console.log(`Table ${table} is empty. Creating empty CSV with headers.`);
        const [fields] = await connection.execute(`DESCRIBE \`${table}\``);
        const headers = fields.map(f => f.Field);
        const csvContent = headers.join(',') + '\n';
        fs.writeFileSync(path.join(exportDir, `${table}.csv`), csvContent);
        continue;
      }

      const headers = Object.keys(rows[0]);
      
      // Helper function to escape CSV cell values
      const escapeCSVValue = (val) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        let str = String(val);
        // Escape double quotes
        str = str.replace(/"/g, '""');
        // Wrap in quotes if it contains comma, newline or quotes
        if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
          str = `"${str}"`;
        }
        return str;
      };

      const csvRows = [];
      csvRows.push(headers.join(',')); // Add header row

      for (const row of rows) {
        const values = headers.map(header => escapeCSVValue(row[header]));
        csvRows.push(values.join(','));
      }

      const csvContent = csvRows.join('\n');
      const csvPath = path.join(exportDir, `${table}.csv`);
      fs.writeFileSync(csvPath, csvContent);
      console.log(`Saved ${table}.csv to: ${csvPath}`);
    }

    console.log('\n--- Export completed successfully! ---');
    console.log(`All files are saved in the directory: ${exportDir}`);
  } catch (err) {
    console.error('Error during CSV export:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
