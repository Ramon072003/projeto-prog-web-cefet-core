import { RegisterUser } from "../../../domain/user-cases/registerUser";
import { MockUserRepository } from "../../../infra/mocks/MockUserRepository";

describe("Register User - UseCase", () => {
  beforeEach(() => {
    const userRepository = MockUserRepository.getInstance();
    userRepository.clear();
  });

  it("should register a new user", async () => {
    const userRepository = MockUserRepository.getInstance();
    const registerUser = new RegisterUser(userRepository);

    const user = await registerUser.execute({
      name: "Ramon Oliveira Silva",
      email: "ramonsilva072003@gmail.com",
      password: "Ramon 7aniver@",
    });

    expect(user).toBeDefined();
    expect(user.name.value).toBe("Ramon Oliveira Silva");
    expect(user.email.value).toBe("ramonsilva072003@gmail.com");

    const findUser = await userRepository.findByEmail(
      "ramonsilva072003@gmail.com"
    );
    expect(findUser).toBe(user);
  });

  it("should throw an error if the user already exists", async () => {
    const userRepository = MockUserRepository.getInstance();
    const registerUser = new RegisterUser(userRepository);

    await registerUser.execute({
      name: "Ramon Oliveira Silva",
      email: "ramonsilva072003@gmail.com",
      password: "Ramon 7aniver@",
    });

    await expect(
      registerUser.execute({
        name: "Ramon Oliveira Silva",
        email: "ramonsilva072003@gmail.com",
        password: "Ramon 7aniver@",
      })
    ).rejects.toThrow("User alredy exist");
  });
});
