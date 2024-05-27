
import express from 'express';
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";
import path from 'path';
import skatersRoutes from './routes/skaters.route.js';
import {verifyTokenJWT } from './middlewares/jwt.middleware.js';


const app = express();

const __dirname = import.meta.dirname;

app.use(cookieParser());
app.use(fileUpload());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,  'public')));

app.use('/skaters', skatersRoutes);

app.get('/protected', verifyTokenJWT, (req, res)=>{
    res.json({ validToken: true, email: req.email});
})

app.get('/', (req, res)=>{
    res.sendFile('index.html');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});