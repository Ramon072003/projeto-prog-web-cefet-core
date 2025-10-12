import { Email } from "../../../domain/value-objects/Email";

describe("Email", () => {
  it("should validate email", () => {
    const email = Email.create("ramonsilva072003@gmail.com");
    expect(email.value).toBe("ramonsilva072003@gmail.com");
  });

  it("should throw erro on validate email", () => {
    expect(() => Email.create("invalidoo")).toThrow();
  });
});
