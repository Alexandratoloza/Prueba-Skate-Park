import { skatersModel } from '../models/skaters.model.js';
import {handleErrorDatabase} from '../database/errors.database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const login = async (req, res) => {
    try{
        const {email, password } = req.body
        const skater = await skatersModel.findByEmail(email)

        if(!skater) return res.status(400).json({
            ok: false,
            msg: "email no registrado"
           })

           if(!password) return res.status(400).json({
            ok: false,
            msg: "contraseña  incorrecta"
           })

    const token = jwt.sign(
        {email: skater.email},
         process.env.SECRET_JWT,
        {expiresIn: '2h'}
    )

    return res.json({
        token,
        email: skater.email
    })
     



    } catch (error) {
        console.log(error)
        const {code, msg} = handleErrorDatabase(error)
        return res.status(code).json({ok: false, msg})
    }

    }


const register = async (req, res) => {
    try {
        const { email, nombre, password, anos_experiencia, especialidad, foto } = req.body;

        const file = req.files.foto

        console.log({ email, nombre, password, anos_experiencia, especialidad, foto })

        const existingSkater = await skatersModel.findByEmail(email);

        if (existingSkater) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario ya registrado"
            });
        }

        const fotonew = foto;
        const uploadPath = pathjoin(__dirname, '../public/assests/img/', fotonew.nombre)

        fotonew.mv(uploadPath, (error) => {
            if (error) {
                console.error('Error al mover el archivo:', error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al subir el archivo',
                    error: error.message
                });
            }
        
            // Si no hay errores, continúa con la lógica
            res.status(200).json({
                ok: true,
                msg: 'Archivo subido exitosamente'
            });
        });
        

        const hashedPassword = await bcrypt.hash(password, 25);

        const newSkater = {
            email,
            nombre,
            password: hashedPassword,
            anos_experiencia,
            especialidad,
            foto: fotonew.nombre
        };

        const createdSkater = await skatersModel.create(newSkater);

        const token = jwt.sign(
            {email: skater.email},
            process.env.SECRET_JWT,
            { expiresIn: '1h'}
        )

        return res.status(201).json({
            ok: true,
            msg: "Usuario registrado exitosamente",
            skater: createdSkater
        });
    } catch (error) {
        console.log(error);
        const { code, msg } = handleErrorDatabase(error);
        return res.status(code).json({ ok: false, msg });
    }
};

const updateSkater= async(req, res) =>{
    try {
        const { email, name, password, anos_experiencia, especialidad } = req.body;

        const user = await skatersModel.update(email, {name, password, anos_experiencia, especialidad});

        return res.json({ok: true, user});
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ok: false, msg: error.msg});
    }
}

const deleteSkater = async(req, res) =>{
    try {

        const { email } = req.body;

        const user = await skatersModel.remove(email);

        return res.json({ok: true, user});
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ok: false, msg: error.msg});    
    }
}

const getUsers = async(req, res) =>{
    try {
        const { email } = req.params;
        const user = await skatersModel.findByEmail(email);
        if (!user) {
            throw { code: 404, msg: 'Usuario no encontrado.' };
        }
        return res.json({user});
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ok: false, msg: error.msg});   
    }
}


const getAll = async(req, res) =>{
    try {
        const users = await skatersModel.findAll();
        return res.json({users});
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ok: false, msg: error.msg});   
    }
}




export const skatersController = {
    login,
    register,
    updateSkater,
    deleteSkater, 
    getUsers,
    getAll
};
