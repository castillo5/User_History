import { Router } from 'express';
import { ClientController } from '@modules/clients/controllers/ClientController';
import { createClientSchema } from '@modules/clients/dto/CreateClientDto';
import { updateClientSchema } from '@modules/clients/dto/UpdateClientDto';
import { validateRequest } from '@middlewares/validation';
import { authenticateJwt } from '@middlewares/authJwt';
import { authorize } from '@middlewares/roles';
import { asyncHandler } from '@utils/asyncHandler';

const router = Router();
const controller = new ClientController();

router.use(authenticateJwt);

/**
 * @openapi
 * /api/v1/clients:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clientes
 *     summary: Lista todos los clientes
 *     responses:
 *       '200':
 *         description: Listado de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 */
router.get('/', authorize(['admin', 'vendedor']), asyncHandler(controller.list));

/**
 * @openapi
 * /api/v1/clients/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clientes
 *     summary: Obtiene un cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Cliente no encontrado
 */
router.get('/:id', authorize(['admin', 'vendedor']), asyncHandler(controller.getById));

/**
 * @openapi
 * /api/v1/clients:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clientes
 *     summary: Crea un cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientCreateRequest'
 *     responses:
 *       '201':
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       '409':
 *         description: Email ya registrado
 */
router.post('/', authorize(['admin', 'vendedor']), validateRequest(createClientSchema), asyncHandler(controller.create));

/**
 * @openapi
 * /api/v1/clients/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clientes
 *     summary: Actualiza un cliente
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
 *             $ref: '#/components/schemas/ClientCreateRequest'
 *     responses:
 *       '200':
 *         description: Cliente actualizado
 *       '404':
 *         description: Cliente no encontrado
 *       '409':
 *         description: Email ya registrado
 */
router.put('/:id', authorize(['admin', 'vendedor']), validateRequest(updateClientSchema), asyncHandler(controller.update));

/**
 * @openapi
 * /api/v1/clients/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clientes
 *     summary: Elimina un cliente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Cliente eliminado
 *       '404':
 *         description: Cliente no encontrado
 */
router.delete('/:id', authorize(['admin']), asyncHandler(controller.delete));

export const clientRoutes = router;
