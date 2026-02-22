import {Client} from '../entities/Client';
import {IClientRepository} from '../repositories/IClientRepository';

export class ClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async getAllClients(): Promise<Client[]> {
    return this.clientRepository.getAll();
  }

  async searchClients(query: string): Promise<Client[]> {
    if (!query.trim()) {
      return this.clientRepository.getAll();
    }
    return this.clientRepository.searchByNameOrPhone(query.trim());
  }

  async getClientById(id: number): Promise<Client | null> {
    return this.clientRepository.getById(id);
  }

  async createClient(name: string, phone: string): Promise<Client> {
    return this.clientRepository.create(name.trim(), phone.trim());
  }

  async updateClient(id: number, name: string, phone: string): Promise<void> {
    return this.clientRepository.update(id, name.trim(), phone.trim());
  }

  async deleteClient(id: number): Promise<void> {
    return this.clientRepository.delete(id);
  }
}
