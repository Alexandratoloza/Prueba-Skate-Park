import 'dotenv/config'

import pg from 'pg'
const { Pool } = pg

const connectionString = process.env.CONNECTION_URL_DATABASE

export const pool = new Pool({
    allowExitOnIdle: true,
    connectionString
})

try {
    await pool.query('SELECT NOW()')
    console.log('conectados a la base de Datos')
} catch (error) {
    console.log(error)
}