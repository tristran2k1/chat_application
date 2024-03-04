import { OnModuleInit, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user.service';
import { JoinedRoomService } from 'src/chat/services/joined-room/joined-room.service';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { IUser } from 'src/models/user/user.interface';
import { UsersService } from 'src/users/services/users/users.service';
import { RoomService } from 'src/chat/services/room/room.service';
import { MessageService } from 'src/chat/services/message/message.service';
import { IRoom } from 'src/models/room/room.interface';
import { IConnectedUser } from 'src/models/connected-user/connected-user.interface';
import { IPage } from 'src/models/page/page.interface';
import { IMessage } from 'src/models/message/message.interface';
import { IJoinedRoom } from 'src/models/joined-room/joined-room.interface';

@WebSocketGateway({
  cors: { origin: ['http://localhost:3000', 'http://localhost:4200'] },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(
    private connectedUsersService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
    private authService: AuthService,
    private userService: UsersService,
    private roomService: RoomService,
    private messageService: MessageService,
  ) {}
  @WebSocketServer()
  server: Server;

  async onModuleInit() {
    await this.connectedUsersService.deleteAll();
    await this.joinedRoomService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const token = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: IUser = await this.userService.findByUsername(token);
      if (!user) {
        return this.disconnect(socket);
      }
      console.log(socket);
      socket.data.user = user;
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      await this.connectedUsersService.create({ socketId: socket.id, user });
      return this.server.to(socket.id).emit('rooms', rooms);
    } catch (error) {
      console.log(error);
      this.disconnect(socket);
    }
  }
  async handleDisconnect(socket: Socket) {
    await this.connectedUsersService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private async disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: IRoom,
  ) {
    const createdRoom: IRoom = await this.roomService.createRoom(
      room,
      socket.data.user,
    );

    for (const user of createdRoom.users) {
      const connections: IConnectedUser[] =
        await this.connectedUsersService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      // substract page -1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() page: IPage,
  ) {
    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      this.handleIncomingPageRequest(page),
    );
    // substract page -1 to match the angular material paginator
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() room: IRoom,
  ) {
    const messages = await this.messageService.findMessagesForRoom(room, {
      limit: 10,
      page: 1,
    });
    messages.meta.currentPage = messages.meta.currentPage - 1;
    // Save Connection to Room
    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    // Send last messages from Room to User
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(@ConnectedSocket() socket: Socket) {
    // remove connection from JoinedRooms
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: IMessage,
  ) {
    const createdMessage: IMessage = await this.messageService.create({
      ...message,
      user: socket.data.user,
    });
    const room: IRoom = await this.roomService.getRoom(createdMessage.room.id);
    const joinedUsers: IJoinedRoom[] =
      await this.joinedRoomService.findByRoom(room);
    // TODO: Send new Message to all joined Users of the room (currently online)
    for (const user of joinedUsers) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private handleIncomingPageRequest(page: IPage) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }
}
