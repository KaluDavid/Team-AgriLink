export type UserRole = "farmer" | "buyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  createdAt: Date;
}
