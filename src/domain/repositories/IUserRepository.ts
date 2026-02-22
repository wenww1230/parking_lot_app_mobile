import {User} from '../entities/User';

export interface IUserRepository {
  findByUsernameAndPassword(username: string, password: string): Promise<User | null>;
}
