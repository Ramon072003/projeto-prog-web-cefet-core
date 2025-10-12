import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Name } from "../../../domain/value-objects/Name";
import { Password } from "../../../domain/value-objects/Password";

describe("Entity User", () => {
  it("shloud create a valid user", () => {
    const user = User.create(
      "1",
      Name.create("Ramon Oliveira Silva"),
      Email.create("ramonsilva072003@gmail.com"),
      Password.create("Ramon 7aniver@")
    );

    expect(user.id).toBe("1");
    expect(user.name.value).toBe("Ramon Oliveira Silva");
    expect(user.email.value).toBe("ramonsilva072003@gmail.com");
    expect(user.password.value).toBe("Ramon 7aniver@");
  });
});
