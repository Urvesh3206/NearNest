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

  // Auth Middleware (Graceful fallback for local dev & guest users)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        socket.data.user = { id: 'local_resident', name: 'Society Resident' };
        return next();
      }

      try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        const user = await prisma.user.findUnique({ where: { firebaseUid: decodedToken.uid } });
        socket.data.user = user || { id: decodedToken.uid, name: decodedToken.name || 'User' };
      } catch {
        socket.data.user = { id: 'local_user', name: 'User' };
      }
      next();
    } catch (err) {
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data?.user?.id || socket.id;
    console.log(`Socket client connected: ${userId}`);
    
    // Join personal room for private notifications
    socket.join(userId);
    
    socket.on('join_society', (societyId: string) => {
      socket.join(`society_${societyId}`);
    });

    // Real-Time Booking Request Event
    socket.on('new-booking-request', (data: any) => {
      console.log('Received new-booking-request event:', data);
      io.emit('new-booking-request', data);
    });

    // Real-Time Booking Status Event
    socket.on('booking-status-updated', (data: any) => {
      console.log('Received booking-status-updated event:', data);
      io.emit('booking-status-updated', data);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${userId}`);
    });
  });

  return io;
};
