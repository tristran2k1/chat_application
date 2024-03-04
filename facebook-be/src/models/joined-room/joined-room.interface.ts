import { IRoom } from "../room/room.interface";
import { IUser } from "../user/user.interface";


export interface IJoinedRoom {
  id?: number;
  socketId: string;
  user: IUser;
  room: IRoom;
}