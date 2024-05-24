import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import skatersRoutes from './routes/skaters.route.js';
import {verifyTokenJWT } from './middlewares/jwt.middleware.js';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/registro.html')
})


app.use('/api/v1/skaters', skatersRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en el puerto ${PORT}`);
});