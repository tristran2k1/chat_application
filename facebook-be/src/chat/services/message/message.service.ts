import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { MessageEntity } from 'src/models/message/message.entity';
import { IMessage } from 'src/models/message/message.interface';
import { IRoom } from 'src/models/room/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepository: Repository<MessageEntity>
      ) { }
    
      async create(message: IMessage): Promise<IMessage> {
        return this.messageRepository.save(this.messageRepository.create(message));
      }
    
      async findMessagesForRoom(room: IRoom, options: IPaginationOptions): Promise<Pagination<IMessage>> {
        const query = this.messageRepository
          .createQueryBuilder('message')
          .leftJoin('message.room', 'room')
          .where('room.id = :roomId', { roomId: room.id })
          .leftJoinAndSelect('message.user', 'user')
          .orderBy('message.created_at', 'DESC');
    
        return paginate(query, options);
    
      }
    
}
