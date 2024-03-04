import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { Profile } from 'src/models/profile/profile.entity';
import { User } from 'src/models/user/user.entity';
import { Repository } from 'typeorm';
import { IUser } from 'src/models/user/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private authService: AuthService,
  ) {}

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.find({ select: ['id', 'username', 'created_at'] });
  }

  // ====
  
  async findByUsername(username: string): Promise<IUser> {
    return this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'created_at'],
    });
  }
}
