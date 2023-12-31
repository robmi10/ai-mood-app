export interface User {
  id?: number;
  name: string;
  age: number;
  createdAt?: Date;
}

export interface DB {
  user: User;
}
