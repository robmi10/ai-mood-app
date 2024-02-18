export interface Users {
  id?: number;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface Moods {
  id?: number;
  userId?: number;
  moodScore: number;
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
