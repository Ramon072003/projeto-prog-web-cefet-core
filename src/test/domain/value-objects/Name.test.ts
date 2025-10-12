import { Name } from "../../../domain/value-objects/Name";

describe("Name", () => {
  it("should be validate name", () => {
    const name = Name.create("Ramon Oliveira Silva");
    expect(name.value).toBe("Ramon Oliveira Silva");
  });

  it("should throw erro on validate name", () => {
    expect(() => Name.create("")).toThrow();
  });
});
