import {RoleId} from './Role';

export interface User {
  id: number;
  username: string;
  roleId: RoleId;
}
