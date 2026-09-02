import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const httpServer = createServer(app);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(hpp());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

const PORT = env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
