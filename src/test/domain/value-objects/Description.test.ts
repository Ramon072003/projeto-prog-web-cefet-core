import { Description } from "../../../domain/value-objects/Description";

describe("Description", () => {
  describe("create", () => {
    it("should create a valid description", () => {
      const description = Description.create("Compra no supermercado");
      expect(description.getValue()).toBe("Compra no supermercado");
    });

    it("should trim whitespace", () => {
      const description = Description.create("  Salário  ");
      expect(description.getValue()).toBe("Salário");
    });

    it("should throw error for empty description", () => {
      expect(() => Description.create("")).toThrow(
        "Description cannot be empty"
      );
      expect(() => Description.create("   ")).toThrow(
        "Description cannot be empty"
      );
    });

    it("should throw error for null or undefined", () => {
      expect(() => Description.create(null as any)).toThrow(
        "Description cannot be empty"
      );
      expect(() => Description.create(undefined as any)).toThrow(
        "Description cannot be empty"
      );
    });

    it("should throw error for description too long", () => {
      const longDescription = "a".repeat(256);
      expect(() => Description.create(longDescription)).toThrow(
        "Description cannot exceed 255 characters"
      );
    });

    it("should accept description with exactly 255 characters", () => {
      const maxDescription = "a".repeat(255);
      const description = Description.create(maxDescription);
      expect(description.getValue()).toBe(maxDescription);
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      const description = Description.create("Teste");
      expect(description.toString()).toBe("Teste");
    });
  });
});
