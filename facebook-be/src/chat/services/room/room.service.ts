import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { RoomEntity } from 'src/models/room/room.entity';
import { IRoom } from 'src/models/room/room.interface';
import { IUser } from 'src/models/user/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}
  async getRoomsForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<IRoom>> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }

  async createRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    const newRoom = await this.addCreatorToRoom(room, creator);
    return this.roomRepository.save(newRoom);
  }

  async getRoom(roomId: number): Promise<IRoom> {
    return this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
    });
  }
  async addCreatorToRoom(room: IRoom, creator: IUser): Promise<IRoom> {
    room.users.push(creator);
    return room;
  }
}
