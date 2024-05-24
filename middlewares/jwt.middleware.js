import jwt from 'jsonwebtoken';

export const verifyTokenJWT = (req, res, next) => {
    try{

        let token = req.headers.authorization
        if(!token) return res.status(401).json({

            ok: false,
            msg: "No autorizado, no se encuentra usuario"
       
        })

        token = token.split("")[1]
       const payload =  jwt.verify(token, process.env.secret_jwt)
        console.log(payload)
        next()


    }catch(error){
        console.log (error)
        return res.status(401).json({
            ok: false,
            msg: "No autorizado"
        })
    }
};