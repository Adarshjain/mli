import express from 'express'
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'

const tableNames = {
  customers: 'Customers',
  projects: 'Projects',
  transactions: 'Transactions'
}

const app = express()
app.use(express.json())
dotenv.config()

async function connect() {
  // @ts-ignore
  return mysql.createConnection(process.env.DATABASE_URL);
}

async function execQuery(query: string) {
  const connection = await connect();
  const resp = await connection.query(query)
  connection.end();
  return resp;
}

function generateInsertQuery(tableName: string, fields: Record<string, string | number>) {
  return `INSERT INTO ${tableName} (${Object.keys(fields).join(",")}) VALUES (${Object.values(fields).map(v => JSON.stringify(v)).join(',')})`
}

Object.values(tableNames).forEach(table => {
  app.get(`/${table}`, async (req, res) => {
    const query = `SELECT * FROM ${table}`
    const [resp] = await execQuery(query);
    res.json(resp)
  });

  app.get(`/${table}/:id`, async (req, res) => {
    const query = `SELECT * FROM ${table} where id=${req.params.id}`
    const [resp] = await execQuery(query);
    res.json(resp)
  });

  app.post(`/${table}`, async (req, res) => {
    const query = generateInsertQuery(table, req.body);
    const [resp] = await execQuery(query);
    res.json(resp)
  });
})


app.get(`/${tableNames.customers}/:id/${tableNames.projects}`, async (req, res) => {
  const query = `SELECT * FROM Projects where customer_id=${req.params.id}`
  const [resp] = await execQuery(query);
  res.json(resp)
});

app.get(`/${tableNames.customers}/:id/${tableNames.transactions}`, async (req, res) => {
  const query = `SELECT * FROM Transactions where customer_id=${req.params.id} order by transact_date asc`
  const [resp] = await execQuery(query);
  res.json(resp)
});

app.get(`/${tableNames.customers}/:id/${tableNames.transactions}/:project_id`, async (req, res) => {
  const query = `SELECT * FROM Transactions where customer_id=${req.params.id} AND project_id=${req.params.project_id} order by transact_date asc`
  const [resp] = await execQuery(query);
  res.json(resp)
});

export default {
  path: '/api',
  handler: app
}
