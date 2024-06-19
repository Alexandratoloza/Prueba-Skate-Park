import { skatersModel } from '../models/skaters.model.js';
import { handleErrorDatabase } from '../database/errors.database.js';
import path from 'path'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const skater = await skatersModel.findByEmail(email);

        if (!skater) {
            return res.status(400).json({
                ok: false,
                msg: "Email no registrado"
            });
        }

        const isMatch = await bcrypt.compare(password, skater.password);
        if (!isMatch) {
            return res.status(400).json({
                ok: false,
                msg: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            { email: skater.email },
            process.env.SECRET_JWT,
            { expiresIn: '2h' }
        );

        return res.json({
            ok: true,
            token,
            email: skater.email
        });

    } catch (error) {
        console.error(error);
        const { code, msg } = handleErrorDatabase(error); 
        return res.status(code).json({ ok: false, msg });
    }
};

const register = async (req, res) => {
    try {
        const { email, name, password, anos_experiencia, especialidad } = req.body;
        const foto = req.files?.foto;
        console.log({ email, name, password, anos_experiencia, especialidad, foto: foto?.name });
        const existingSkater = await skatersModel.findByEmail(email);
        if (existingSkater) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario ya registrado'
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        let pictureFileName = null;
        if (foto) {
            pictureFileName = foto.name;
            const uploadPath = path.join(__dirname, '../public/img/', pictureFileName);
            await foto.mv(uploadPath);
        }

        const newSkater = {
            email,
            name,
            password: hashedPassword,
            anos_experiencia,
            especialidad,
            foto: pictureFileName
        };

        const createdSkater = await skatersModel.create(newSkater);


        const token = jwt.sign(
            { email: createdSkater.email },
            process.env.SECRET_JWT,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            ok: true,
            msg: 'Usuario registrado exitosamente',
            skater: createdSkater,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: 'Internal Server Error' });
    }
};



const updateSkater = async (req, res) => {
    try {
        const { email, name, password, anos_experiencia, especialidad } = req.body;

        const user = await skatersModel.update(email, { name, password, anos_experiencia, especialidad });

        return res.json({ ok: true, user });
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ ok: false, msg: error.msg });
    }
}

const verifiedState = async (req, res) => {
    try {
        const { email, estado } = req.body;
        const user = await skatersModel.verifiedState(email, estado)
        return res.json({ ok: true, user });
    } catch (error) {
        console.log(error)
        return res.status(error.code).json({ ok: false, msg: error.msg });
    }
}

const deleteSkater = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await skatersModel.remove(email);

        return res.json({ ok: true, user });
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ ok: false, msg: error.msg });
    }
}

const getUsers = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await skatersModel.findByEmail(email);
        if (!user) {
            throw { code: 404, msg: 'Usuario no encontrado.' };
        }
        return res.json({ user });
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ ok: false, msg: error.msg });
    }
}


const getAll = async (req, res) => {
    try {
        const users = await skatersModel.findAll();
        return res.json({ users });
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ ok: false, msg: error.msg });
    }
}




export const skatersController = {
    login,
    register,
    updateSkater,
    verifiedState,
    deleteSkater,
    getUsers,
    getAll
};
