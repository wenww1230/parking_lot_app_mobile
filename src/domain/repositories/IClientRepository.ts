import {Client} from '../entities/Client';

export interface IClientRepository {
  getAll(): Promise<Client[]>;
  getById(id: number): Promise<Client | null>;
  searchByNameOrPhone(query: string): Promise<Client[]>;
  create(name: string, phone: string): Promise<Client>;
  update(id: number, name: string, phone: string): Promise<void>;
  delete(id: number): Promise<void>;
}
