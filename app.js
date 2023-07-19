const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Function to insert data into the database
async function insertData(name, email) {
  const tableName = 'adityamore'; // Replace with your desired table name

  try {
    // Create the connection using the DATABASE_URL from .env
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // Insert data into the table
    const insertQuery = `
      INSERT INTO ${tableName} (name, email)
      VALUES (?, ?)
    `;

    await connection.query(insertQuery, [name, email]);
    console.log('Data inserted successfully.');

    // Close the connection
    connection.end();
  } catch (error) {
    console.error('Error connecting to PlanetScale:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

app.post('/insertData', async (req, res) => {
  const { name, email } = req.body;

console.log(name);
  try {
    await insertData(name, email);
    res.status(200).json({ message: 'Data inserted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', (req, res) => {
      const sql = `SELECT * FROM adityamore`;
      connection.query(sql, (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(result);
        }
      });
    });


// Check the database connection before starting the server
async function checkDatabaseConnection() {
  try {
    // Create the connection using the DATABASE_URL from .env
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // If the connection is successful, log a message
    console.log('Connected to PlanetScale database!');
    connection.end();
  } catch (error) {
    console.error('Error connecting to PlanetScale:', error);
    process.exit(1); // Exit the process if the connection fails
  }
}

// Check the database connection before starting the server
checkDatabaseConnection()
  .then(() => {
    // Start the server after successful database connection
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch((err) => {
    console.error('Server failed to start:', err.message);
  });
