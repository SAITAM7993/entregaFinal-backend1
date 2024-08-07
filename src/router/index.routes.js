import { Router } from 'express';
import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';
import sessionRouter from './session.routes.js';

const router = Router();

router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/session', sessionRouter);

//para controlar rutas que ingresen, si no existe la ruta devuelvo error, funciona para TODAS las rutas, PRODUCTS, CART, SESSION
router.get('*', async (req, res) => {
  try {
    res.status(404).json({ status: 'error', msg: 'Route not found' });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'Error', msg: 'Error interno del servidor' });
  }
});
export default router;
