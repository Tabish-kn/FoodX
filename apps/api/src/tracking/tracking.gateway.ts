import { Server, Socket } from 'socket.io';
import { prisma } from '../db/prisma';

export function setupTrackingGateway(io: Server) {
  const trackingNamespace = io.of('/tracking');

  trackingNamespace.on('connection', (socket: Socket) => {
    console.log(`📡 [WS TRACKING] Client connected: ${socket.id}`);

    socket.on('join_delivery', (deliveryId: string) => {
      socket.join(`delivery_${deliveryId}`);
      console.log(`📡 [WS TRACKING] Socket ${socket.id} joined room delivery_${deliveryId}`);
    });

    socket.on('update_courier_location', async (data: { deliveryId: string; latitude: number; longitude: number; etaMinutes?: number; distanceRemainingKm?: number }) => {
      const { deliveryId, latitude, longitude, etaMinutes, distanceRemainingKm } = data;

      try {
        await prisma.delivery.update({
          where: { id: deliveryId },
          data: {
            currentLatitude: latitude,
            currentLongitude: longitude,
            etaMinutes,
            distanceRemainingKm,
            lastLocationTime: new Date()
          }
        });

        // Broadcast to all subscribed listeners in room
        trackingNamespace.to(`delivery_${deliveryId}`).emit('courier_location_changed', {
          deliveryId,
          latitude,
          longitude,
          etaMinutes,
          distanceRemainingKm,
          timestamp: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to update courier location in WS:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`📡 [WS TRACKING] Client disconnected: ${socket.id}`);
    });
  });
}
