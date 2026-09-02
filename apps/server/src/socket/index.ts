import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { firebaseAdmin } from '../config/firebase';
import { prisma } from '../config/database';
import { env } from '../config/env';

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true,
    },
  });

  // Auth Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('Authentication error');

      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
      
      if (!user) throw new Error('User not found');
      
      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.data.user.id}`);
    
    // Join personal room for private notifications
    socket.join(socket.data.user.id);
    
    socket.on('join_society', (societyId: string) => {
      socket.join(`society_${societyId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.id}`);
    });
  });

  return io;
};
