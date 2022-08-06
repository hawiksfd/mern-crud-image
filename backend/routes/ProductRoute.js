import express from 'express';
import { deleteProduct, getProduct, getProductById, saveProduct, updateProduct } from '../controllers/ProductContr.js';

const router = express.Router();

router.get('/products', getProduct);
router.get('/products/:id', getProductById);
router.post('/products', saveProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);


export default router;