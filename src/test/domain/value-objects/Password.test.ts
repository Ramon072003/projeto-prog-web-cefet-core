import { Password } from "../../../domain/value-objects/Password";

describe("Password", () => {
  it("should be validate password", () => {
    const password = Password.create("Ramon 7aniver@");
    expect(password.value).toBe("Ramon 7aniver@");
  });

  it("should throw error on password length", () => {
    expect(() => Password.create("R")).toThrow();
  });

  it("should throw error on not up character", () => {
    expect(() => Password.create("ramon 7aniver@")).toThrow();
  });

  it("should throw error on not small character", () => {
    expect(() => Password.create("RAMON 7ANIVER@")).toThrow();
  });

  it("should throw error on not password length", () => {
    expect(() => Password.create("Ramon aniver@")).toThrow();
  });

  it("should throw error on not special character length", () => {
    expect(() => Password.create("Ramonaniver")).toThrow();
  });
});
