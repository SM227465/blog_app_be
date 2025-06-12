import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import userRouter from './routes/user.route';
import blogRouter from './routes/blog.route';
import commentRouter from './routes/comment.route';
import errorHandler from './controllers/error.controller';
import { swaggerSpec } from './configs/swagger.config';

const app = express();

app.set('trust proxy', 'loopback');
app.use(cors());
app.options('*', cors());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'https://blog-rdlk.onrender.com'],
    },
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from your IP, please try again in an hour.',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    messgae: 'Hello from root route',
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/comments', commentRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `can not find ${req.originalUrl} on this server`,
  });
});

// 3. Global error handler
app.use(errorHandler);

export default app;
