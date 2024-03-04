import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/models/user/user.interface';
import { Profile } from 'src/models/profile/profile.entity';
import { User } from 'src/models/user/user.entity';
import { Repository } from 'typeorm';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async validateUser({ username, password }: IUser) {
    const findUser = await this.userRepository.findOne({ where: { username } });
    if (!findUser || !this.comparePasswords(password, findUser.password)) {
      return null;
    }
    delete findUser.password;
    return {
      ...findUser,
      access_token: this.jwtService.sign(findUser.username),
    };
  }

  async registerUser(data: IUser) {
    const user = await this.userRepository.findOne({
      where: { username: data.username },
    });
    if (user) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const hashPass = await this.hashPassword(data.password);
    const newUser = await this.userRepository.save(
      this.userRepository.create({
        username: data.username,
        password: hashPass,
        created_at: new Date(),
      }),
    );
    this.profileRepository.save(
      this.profileRepository.create({
        firstName: '',
        lastName: '',
        dob: new Date(),
        username: newUser.username,
        id: newUser.id,
      }),
    );
    delete newUser.password;
    return {
      ...newUser,
      access_token: this.jwtService.sign(newUser.username),
    };
  }

 
  // ====

  comparePasswords(password: string, storedPasswordHash: string): any {
    return bcrypt.compareSync(password, storedPasswordHash);
  }
  hashPassword(password: string): string | PromiseLike<string> {
    return bcrypt.hash(password, 10);
  }

  async generateJwt(username: string): Promise<string> {
    return this.jwtService.signAsync({ user: username });
  }

  async verifyJwt(token: string): Promise<any> {
    console.log(token);
    return this.jwtService.verify(token);
  }
}
