import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/models/connected-user/connected-user.entity';
import { IConnectedUser } from 'src/models/connected-user/connected-user.interface';
import { IUser } from 'src/models/user/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}
  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }
  async create(connectedUser: IConnectedUser): Promise<IConnectedUser> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: IUser): Promise<IConnectedUser[]> {
    return this.connectedUserRepository.find({ where: { user } });
  }

  deleteBySocketId(id: string) {
    return this.connectedUserRepository.delete({ socketId: id });
  }
  
}
