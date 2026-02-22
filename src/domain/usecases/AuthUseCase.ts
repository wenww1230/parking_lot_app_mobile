import {User} from '../entities/User';
import {IUserRepository} from '../repositories/IUserRepository';
import {ISessionRepository} from '../repositories/ISessionRepository';

export class AuthUseCase {
  constructor(
    private userRepository: IUserRepository,
    private sessionRepository: ISessionRepository
  ) {}

  async login(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findByUsernameAndPassword(username, password);
    if (!user) {
      throw new Error('Usuario o contraseña incorrectos');
    }
    await this.sessionRepository.storeUser(user);
    return user;
  }

  async logout(): Promise<void> {
    await this.sessionRepository.clearSession();
  }

  async getStoredSession(): Promise<User | null> {
    return this.sessionRepository.getStoredUser();
  }
}
