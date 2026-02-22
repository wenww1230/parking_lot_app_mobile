import {User} from '../entities/User';

export interface ISessionRepository {
  getStoredUser(): Promise<User | null>;
  storeUser(user: User): Promise<void>;
  clearSession(): Promise<void>;
}
