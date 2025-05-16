import { User } from "../model/User";

export interface SignUpDTO extends User {
  email: string;
  password: string;
  username: string;
}