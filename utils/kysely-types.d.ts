export interface Users {
  id?: number;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface DB {
  users: Users;
}
