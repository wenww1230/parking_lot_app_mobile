import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../../domain/entities/User';
import {ISessionRepository} from '../../domain/repositories/ISessionRepository';

const SESSION_KEY = '@parking_session_user';

export class SessionRepositoryImpl implements ISessionRepository {
  async getStoredUser(): Promise<User | null> {
    const json = await AsyncStorage.getItem(SESSION_KEY);
    if (!json) return null;
    try {
      return JSON.parse(json) as User;
    } catch {
      return null;
    }
  }

  async storeUser(user: User): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
}
