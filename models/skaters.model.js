import { pool } from "../database/connection.database.js";

const findByEmail = async (email) => {
    const query = {
        text: `
        SELECT * FROM skaters 
        WHERE email = $1
        `,
        values: [email]
    };

    try {
        const { rows } = await pool.query(query);
        return rows[0];
    } catch (error) {
        throw new Error(`Error al buscar por email: ${error.message}`);
    }
};

const create = async ({ email, nombre, password, anos_experiencia, especialidad, foto, estado }) => {
    const query = {
        text: `
        INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        values: [email, nombre, password, anos_experiencia, especialidad, foto, estado]
    };

    try {
        const { rows } = await pool.query(query);
        return rows[0];
    } catch (error) {
        throw new Error(`Error al crear el skater: ${error.message}`);
    }
};

export const skatersModel = {
    findByEmail,
    create,
};
