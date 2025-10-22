import { Router } from 'express';
import { OrderController } from '@modules/orders/controllers/OrderController';
import { createOrderSchema } from '@modules/orders/dto/CreateOrderDto';
import { queryOrderSchema } from '@modules/orders/dto/QueryOrderDto';
import { updateOrderStatusSchema } from '@modules/orders/dto/UpdateOrderStatusDto';
import { validateRequest, validateQuery } from '@middlewares/validation';
import { authenticateJwt } from '@middlewares/authJwt';
import { authorize } from '@middlewares/roles';
import { asyncHandler } from '@utils/asyncHandler';

const router = Router();
const controller = new OrderController();

router.use(authenticateJwt);

/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pedidos
 *     summary: Lista pedidos con filtros opcionales
 *     parameters:
 *       - in: query
 *         name: clienteId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: productoId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, preparando, entregado]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
router.get('/', authorize(['admin', 'vendedor']), validateQuery(queryOrderSchema), asyncHandler(controller.list));

/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pedidos
 *     summary: Obtiene un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       '404':
 *         description: Pedido no encontrado
 */
router.get('/:id', authorize(['admin', 'vendedor']), asyncHandler(controller.getById));

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pedidos
 *     summary: Crea un pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateRequest'
 *     responses:
 *       '201':
 *         description: Pedido creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Stock insuficiente o datos inválidos
 *       '404':
 *         description: Producto o cliente no encontrado
 */
router.post('/', authorize(['admin', 'vendedor']), validateRequest(createOrderSchema), asyncHandler(controller.create));

/**
 * @openapi
 * /api/v1/orders/{id}/estado:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pedidos
 *     summary: Actualiza el estado de un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, preparando, entregado]
 *     responses:
 *       '200':
 *         description: Pedido actualizado
 *       '400':
 *         description: Estado inválido
 *       '404':
 *         description: Pedido no encontrado
 */
router.patch('/:id/estado', authorize(['admin', 'vendedor']), validateRequest(updateOrderStatusSchema), asyncHandler(controller.updateStatus));

/**
 * @openapi
 * /api/v1/orders/{id}/sensible:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pedidos
 *     summary: Obtiene los datos sensibles cifrados de un pedido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Datos sensibles descifrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       '404':
 *         description: Pedido no encontrado o sin datos sensibles
 *       '403':
 *         description: Permisos insuficientes
 */
router.get('/:id/sensible', authorize(['admin']), asyncHandler(controller.getSensitiveData));

export const orderRoutes = router;
