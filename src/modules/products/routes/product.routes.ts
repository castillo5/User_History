import { Router } from 'express';
import { ProductController } from '@modules/products/controllers/ProductController';
import { createProductSchema } from '@modules/products/dto/CreateProductDto';
import { updateProductSchema } from '@modules/products/dto/UpdateProductDto';
import { validateRequest } from '@middlewares/validation';
import { authenticateJwt } from '@middlewares/authJwt';
import { authorize } from '@middlewares/roles';
import { asyncHandler } from '@utils/asyncHandler';

const router = Router();
const controller = new ProductController();

router.use(authenticateJwt);

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     summary: Lista todos los productos
 *     responses:
 *       '200':
 *         description: Listado de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno
 */
router.get('/', authorize(['admin', 'vendedor']), asyncHandler(controller.list));

/**
 * @openapi
 * /api/v1/products/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     summary: Obtiene un producto por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Producto no encontrado
 *       '401':
 *         description: No autorizado
 */
router.get('/:id', authorize(['admin', 'vendedor']), asyncHandler(controller.getById));

/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     summary: Crea un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       '201':
 *         description: Producto creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       '409':
 *         description: Código duplicado
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autorizado
 */
router.post('/', authorize(['admin']), validateRequest(createProductSchema), asyncHandler(controller.create));

/**
 * @openapi
 * /api/v1/products/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     summary: Actualiza un producto existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       '200':
 *         description: Producto actualizado
 *       '404':
 *         description: Producto no encontrado
 *       '409':
 *         description: Código duplicado
 */
router.put('/:id', authorize(['admin']), validateRequest(updateProductSchema), asyncHandler(controller.update));

/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     summary: Elimina un producto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Producto eliminado
 *       '404':
 *         description: Producto no encontrado
 */
router.delete('/:id', authorize(['admin']), asyncHandler(controller.delete));

export const productRoutes = router;
