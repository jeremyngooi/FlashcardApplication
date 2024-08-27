import express, { query } from 'express';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const app = express();
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'project',
  password: process.env.PASSWORD,
  port: 5432,
}); 

app.use(express.json());
app.use(express.static('client'));

app.post('/flashcard/createSet', async (req, res) => {
  try {
    const { name } = req.query;
    const queryText = `CREATE TABLE IF NOT EXISTS ${name} (
      term varchar(100) PRIMARY KEY,
      definition varchar(100)
    );`;
    const set = await db.query(queryText);
    res.json(set.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.post('/flashcard/create', async (req, res) => {
  try {
    const { term, definition, name } = req.query;
    const queryText = `INSERT INTO ${name}(term, definition) VALUES('${term}', '${definition}') RETURNING *;`;
    const flashcard = await db.query(queryText);
    res.json(flashcard.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/flashcard/read', async (req, res) => {
  try {
    const { term, name } = req.query;
    const queryText = `SELECT * FROM ${name} WHERE term = '${term}';`;
    const flashcard = await db.query(queryText);
    res.json(flashcard.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/flashcard/update', async (req, res) => {
  try {
    const { term, definition, name } = req.query;
    const queryText = `UPDATE ${name} SET definition = '${definition}' WHERE term = '${term}' RETURNING *;`;
    const flashcard = await db.query(queryText);
    res.json(flashcard.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/flashcard/delete', async (req, res) => {
  try {
    const { term, name } = req.query;
    const queryText = `DELETE FROM ${name} WHERE term = '${term}' RETURNING *;`;
    const flashcard = await db.query(queryText);
    res.json(flashcard.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/flashcard/deleteSet', async (req, res) => {
  try {
    const { name } = req.query;
    const queryText = `DROP TABLE ${name};`;
    const flashcard = await db.query(queryText);
    res.json(flashcard.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/', (req, res) => {
  res.redirect('/flashcard');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`); 
});
