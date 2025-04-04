import express from 'express';
import { Login, SignUp } from '../controllers/LoginAndSignup.js';
import { CreatePayment, GetPayment } from '../controllers/TransactionController.js';
import { CloseController, GetCloseController } from '../controllers/CloseController.js';

const router = express.Router();

router.post('/signin', SignUp).post('/login', Login).post('/createPayment', CreatePayment).get('/Getpayment', GetPayment).post('/saveCashBank', CloseController).get('/getsaveCashBank', GetCloseController)

export default router;
