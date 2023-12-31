export interface Users {
  id?: number;
  name: string;
  age: number;
  createdAt?: Date;
}

export interface DB {
  users: Users;
}
