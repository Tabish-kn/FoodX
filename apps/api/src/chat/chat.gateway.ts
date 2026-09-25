import { Server, Socket } from 'socket.io';
import { prisma } from '../db/prisma';

export function setupChatGateway(io: Server) {
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket: Socket) => {
    console.log(`💬 [WS CHAT] Client connected: ${socket.id}`);

    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat_${chatId}`);
      console.log(`💬 [WS CHAT] Socket ${socket.id} joined chat_${chatId}`);
    });

    socket.on('send_message', async (data: { chatId: string; senderId: string; content: string; imageUrl?: string }) => {
      const { chatId, senderId, content, imageUrl } = data;
      try {
        const message = await prisma.chatMessage.create({
          data: {
            chatId,
            senderId,
            content,
            imageUrl
          },
          include: {
            sender: { select: { id: true, fullName: true, role: true } }
          }
        });

        // Broadcast to chat room
        chatNamespace.to(`chat_${chatId}`).emit('new_message', message);
      } catch (err) {
        console.error('Failed to send chat message in WS:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`💬 [WS CHAT] Client disconnected: ${socket.id}`);
    });
  });
}
