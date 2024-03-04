import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUserEntity } from 'src/models/connected-user/connected-user.entity';
import { JoinedRoomEntity } from 'src/models/joined-room/joined-room.entity';
import { MessageEntity } from 'src/models/message/message.entity';
import { RoomEntity } from 'src/models/room/room.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { ConnectedUserService } from './services/connected-user/connected-user.service';
import { JoinedRoomService } from './services/joined-room/joined-room.service';
import { RoomService } from './services/room/room.service';
import { MessageService } from './services/message/message.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([
      RoomEntity,
      ConnectedUserEntity,
      MessageEntity,
      JoinedRoomEntity,
    ]),
  ],
  providers: [
    ChatGateway,
    ConnectedUserService,
    JoinedRoomService,
    RoomService,
    MessageService,
  ],
})
export class ChatModule {}
