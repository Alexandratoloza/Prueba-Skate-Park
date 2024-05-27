import {Router } from 'express';
import { skatersController } from '../controllers/skaters.controller.js';
import { verifyTokenJWT } from '../middlewares/jwt.middleware.js';



const router = Router()



router.get('/user/:email', skatersController.getUsers);
router.get('/users', skatersController.getAll)

router.post('/login', skatersController.login);
router.post('/register', skatersController.register);

router.put('/edit', verifyTokenJWT, skatersController.updateSkater);
router.delete('/delete', verifyTokenJWT, skatersController.deleteSkater);






export default router;