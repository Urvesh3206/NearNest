"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from '@/config/app';
import { useAuth } from './AuthProvider';
import { auth } from '@/lib/firebase';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let newSocket: Socket;

    const connectSocket = async () => {
      if (user) {
        const token = await auth?.currentUser?.getIdToken();
        newSocket = io(APP_CONFIG.socketUrl, {
          auth: { token },
          reconnection: true,
        });

        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));
        
        setSocket(newSocket);
      }
    };

    connectSocket();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
