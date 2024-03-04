import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { ConnectedUserEntity } from '../connected-user/connected-user.entity';
import { JoinedRoomEntity } from '../joined-room/joined-room.entity';
import { MessageEntity } from '../message/message.entity';
import { RoomEntity } from '../room/room.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  created_at?: Date;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
  
  @ManyToMany(() => RoomEntity, room => room.users)
  rooms: RoomEntity[]

  @OneToMany(() => ConnectedUserEntity, connection => connection.user)
  connections: ConnectedUserEntity[];

  @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, message => message.user)
  messages: MessageEntity[];
  @BeforeInsert()
  usernameToLowerCase() {
    this.username = this.username.toLowerCase();
  }

}
