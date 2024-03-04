import { IUser } from "../user/user.interface";

export interface IRoom {
  id?: number;
  name?: string;
  description?: string;
  users?: IUser[];
  created_at?: Date;
  updated_at?: Date;
}
