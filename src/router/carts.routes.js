import { Router } from 'express';
// import cartManager from '../dao/fileSystem/managers/cart.manager.js'; // ya no se usan los managers, reemplazado por los daos
// import productManager from '../dao/fileSystem/managers/product.manager.js';
import cartDao from '../dao/mongoDB/cart.dao.js';
import { checkProductExists } from '../middlewares/checkProductExists.middleware.js';
import { checkCartExists } from '../middlewares/checkCartExists.middleware.js';
import { checkProductQtyUpdate } from '../middlewares/checkProductQtyUpdate.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { passportCall } from '../middlewares/passport.middleware.js';

//nota: definir los controles sobre carritos, ej si para crear carrito hay que ser admin.. ver si afecta en el back al crear el carrito automaticamente cuando se crea el usuario, se agregaron algunos controles de autorizacion segun creia conveniente, casi todos controlan el jwt

const router = Router();

//CREAR CARRITO *************************************
router.post('/', async (req, res) => {
  try {
    const cart = await cartDao.create();

    res.status(201).json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Error interno del servidor' });
  }
});

//OBTENER CARRITO PRO CID *************************************
router.get('/:cid', passportCall('jwt'), checkCartExists, async (req, res) => {
  try {
    const { cid } = req.params; //obtengo cid de los parms
    const cart = await cartDao.getById(cid);
    res.status(200).json({ status: 'success', cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 'error', msg: 'Error interno del servidor' });
  }
});

//OBTENER CARRITOS *************************************
router.get(
  '/',
  passportCall('jwt'),
  authorization('admin'),
  async (req, res) => {
    try {
      // const carts = await cartManager.getCarts();
      const carts = await cartDao.getAll();
      if (!carts)
        return res
          .status(404)
          .json({ status: 'Error', msg: 'No existen carritos' });

      res.status(200).json({ status: 'success', carts });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: 'error', msg: 'Error interno del servidor' });
    }
  }
);

//AGREGAR PRODUCTO A CARRITO *************************************
router.post(
  '/:cid/product/:pid',
  passportCall('jwt'),
  checkProductExists,
  checkCartExists,
  async (req, res) => {
    try {
      //hago controles de existencia en los middlewares
      const { cid, pid } = req.params; //obtengo cid y pid de parms
      const cart = await cartDao.addProductToCart(cid, pid);

      res.status(200).json({ status: 'success', cart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: 'error', msg: 'Error interno del servidor' });
    }
  }
);

//BORRAR PRODUCTO A CARRITO *************************************
router.delete(
  '/:cid/product/:pid',
  passportCall('jwt'),
  checkProductExists,
  checkCartExists,
  async (req, res) => {
    try {
      //hago controles de existencia en los middlewares
      const { cid, pid } = req.params; //obtengo cid y pid de parms
      const cart = await cartDao.deleteProductFromCart(cid, pid);

      res.status(200).json({ status: 'success', cart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: 'error', msg: 'Error interno del servidor' });
    }
  }
);

//MODIFICA CANTIDAD DE UN PRODUCTO EN EL CARRITO *************************************
router.put(
  '/:cid/product/:pid',
  passportCall('jwt'),
  checkProductExists,
  checkCartExists,
  checkProductQtyUpdate,
  async (req, res) => {
    try {
      //hago controles de existencia en los middlewares
      const { cid, pid } = req.params; //obtengo cid y pid de parms
      const { quantity } = req.body; //obtengo qty del body del request, importante que se llame igual a lo que le pase
      const cart = await cartDao.updateProductQtyInCart(
        cid,
        pid,
        Number(quantity)
      );
      res.status(200).json({ status: 'success', cart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: 'error', msg: 'Error interno del servidor' });
    }
  }
);

//BORRAR PRODUCTO A CARRITO *************************************
router.delete(
  '/:cid',
  passportCall('jwt'),
  checkCartExists,
  async (req, res) => {
    try {
      //hago controles de existencia en los middlewares
      const { cid } = req.params; //obtengo cid y pid de parms
      const cart = await cartDao.emptyCart(cid);
      res.status(200).json({ status: 'success', cart });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: 'error', msg: 'Error interno del servidor' });
    }
  }
);

export default router;
