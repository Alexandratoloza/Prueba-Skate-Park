import {Router } from 'express';
import { skatersController } from '../controllers/skaters.controller.js';



const router = Router()

router.post('/login', skatersController.login);
router.post('/register', skatersController.register);



export default router;