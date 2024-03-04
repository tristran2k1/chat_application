import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";
import { User } from "../user/user.entity";

@Entity({name:"joined_room"})
export class JoinedRoomEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => User, user => user.joinedRooms)
  @JoinColumn()
  user: User;

  @ManyToOne(() => RoomEntity, room => room.joinedUsers)
  @JoinColumn()
  room: RoomEntity;

}