import { IUser } from "../user/user.interface";


export interface IConnectedUser {
  id?: number;
  socketId: string;
  user: IUser;
}