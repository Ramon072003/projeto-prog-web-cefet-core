import { Amount } from "../../../domain/value-objects/Amount";

describe("Amount", () => {
  describe("create", () => {
    it("should create a valid amount", () => {
      const amount = Amount.create(100.5);
      expect(amount.getValue()).toBe(100.5);
    });

    it("should round to 2 decimal places", () => {
      const amount = Amount.create(100.999);
      expect(amount.getValue()).toBe(101);
    });

    it("should throw error for zero amount", () => {
      expect(() => Amount.create(0)).toThrow(
        "Amount must be greater than zero"
      );
    });

    it("should throw error for negative amount", () => {
      expect(() => Amount.create(-10)).toThrow(
        "Amount must be greater than zero"
      );
    });

    it("should throw error for invalid number", () => {
      expect(() => Amount.create(NaN)).toThrow("Amount must be a valid number");
      expect(() => Amount.create(Infinity)).toThrow(
        "Amount must be a valid number"
      );
    });
  });

  describe("toString", () => {
    it("should format amount with 2 decimal places", () => {
      const amount = Amount.create(100.5);
      expect(amount.toString()).toBe("100.50");
    });
  });
});
