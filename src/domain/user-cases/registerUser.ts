import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";
import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const { name, email, password } = params;
    const verifyUserExist = await this.userRepository.findByEmail(email);

    if (verifyUserExist) {
      throw new Error("User alredy exist");
    }

    const hasehedPassword = await this.hashPassword(password);

    const user = User.create(
      Math.random().toString(),
      Name.create(name),
      Email.create(email),
      Password.create(hasehedPassword)
    );

    await this.userRepository.save(user);

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return `hashed_${password}`;
  }
}
