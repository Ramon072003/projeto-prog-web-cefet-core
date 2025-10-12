import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { Name } from "../../domain/value-objects/Name";
import { Password } from "../../domain/value-objects/Password";

export class MockUserRepository implements IUserRepository {
  private static instance: MockUserRepository;
  private users: User[] = [];

  private constructor() {}

  public static getInstance(): MockUserRepository {
    if (!MockUserRepository.instance) {
      MockUserRepository.instance = new MockUserRepository();
    }
    return MockUserRepository.instance;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async update(user: User): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const userFind = this.users.find((user) => user.email.value === email);
    return userFind ? userFind : null;
  }

  async findById(id: string): Promise<User | null> {
    const userFind = this.users.find((user) => user.id === id);
    return userFind ? userFind : null;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  public clear(): void {
    this.users = [];
  }
}
