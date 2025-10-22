import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from '@config/env';
import { swaggerSpec } from '@docs/swagger';
import { authRoutes } from '@modules/auth/routes/auth.routes';
import { productRoutes } from '@modules/products/routes/product.routes';
import { clientRoutes } from '@modules/clients/routes/client.routes';
import { orderRoutes } from '@modules/orders/routes/order.routes';
import { errorHandler } from '@middlewares/errorHandler';
import { notFoundHandler } from '@middlewares/notFound';
import { securityHeaders } from '@middlewares/securityHeaders';
import { requestLogger } from '@middlewares/requestLogger';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(securityHeaders());
app.use(requestLogger(env.NODE_ENV !== 'production'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);
