import { IUserRepository } from "../domain/repositories/IUserRepository";
import { RegisterUser } from "../domain/user-cases/registerUser";
import { MockUserRepository } from "../infra/mocks/MockUserRepository";

export function MakeUserUserCase() {
  const userRepository: IUserRepository = MockUserRepository.getInstance();

  const registerUser = new RegisterUser(userRepository);

  return {
    registerUser,
  };
}
