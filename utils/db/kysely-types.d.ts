export interface Users {
  id?: number;
  name: string;
  email: string;
  createdAt?: Date;
  password?: password
}

export interface Moods {
  id?: number;
  userId?: number;
  moodScore: string;
  notes?: string;
  createdAt?: Date;
  activities?: string[]
  sleepQuality?: string,
  weather?: string
}

export interface DB {
  users: Users;
  moods: Moods;
}
