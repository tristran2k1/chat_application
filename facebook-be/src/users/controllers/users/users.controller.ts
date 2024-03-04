import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  @UseGuards(JwtGuard)
  updateUser(@Body() body: any) {}

  @Get('find-by-username')
  @UseGuards(JwtGuard)
  async getUserById(@Query('username') username: string) {
    console.log(username);
    if(!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }
    const res = await this.usersService.findByUsername(username);
    if (!res) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return res;
  }
}
