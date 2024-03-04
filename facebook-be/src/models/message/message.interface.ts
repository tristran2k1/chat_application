import { IRoom } from "../room/room.interface";
import { IUser } from "../user/user.interface";


export interface IMessage {
  id?: number;
  text: string;
  user: IUser;
  room: IRoom;
  created_at: Date;
  updated_at: Date;
}