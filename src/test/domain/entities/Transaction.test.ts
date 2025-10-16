import { Transaction } from "../../../domain/entities/Transaction";
import { Amount } from "../../../domain/value-objects/Amount";
import { Description } from "../../../domain/value-objects/Description";
import { TransactionTypeVO } from "../../../domain/value-objects/TransactionType";

describe("Transaction", () => {
  const validId = "transaction-123";
  const validUserId = "user-123";
  const validAmount = Amount.create(100.5);
  const validDescription = Description.create("Compra no supermercado");
  const validDate = new Date("2023-10-15");

  describe("create", () => {
    it("should create a valid income transaction", () => {
      const type = TransactionTypeVO.createIncome();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription,
        validDate
      );

      expect(transaction.id).toBe(validId);
      expect(transaction.userId).toBe(validUserId);
      expect(transaction.type).toBe(type);
      expect(transaction.amount).toBe(validAmount);
      expect(transaction.description).toBe(validDescription);
      expect(transaction.createdAt).toBe(validDate);
    });

    it("should create a valid expense transaction", () => {
      const type = TransactionTypeVO.createExpense();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription,
        validDate
      );

      expect(transaction.type).toBe(type);
      expect(transaction.isExpense()).toBe(true);
      expect(transaction.isIncome()).toBe(false);
    });

    it("should use current date if not provided", () => {
      const type = TransactionTypeVO.createIncome();
      const beforeCreate = new Date();

      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription
      );

      const afterCreate = new Date();

      expect(transaction.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(transaction.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
    });

    it("should throw error for empty transaction ID", () => {
      const type = TransactionTypeVO.createIncome();

      expect(() =>
        Transaction.create("", validUserId, type, validAmount, validDescription)
      ).toThrow("Transaction ID cannot be empty");

      expect(() =>
        Transaction.create(
          "   ",
          validUserId,
          type,
          validAmount,
          validDescription
        )
      ).toThrow("Transaction ID cannot be empty");
    });

    it("should throw error for empty user ID", () => {
      const type = TransactionTypeVO.createIncome();

      expect(() =>
        Transaction.create(validId, "", type, validAmount, validDescription)
      ).toThrow("User ID cannot be empty");

      expect(() =>
        Transaction.create(validId, "   ", type, validAmount, validDescription)
      ).toThrow("User ID cannot be empty");
    });

    it("should trim whitespace from IDs", () => {
      const type = TransactionTypeVO.createIncome();
      const transaction = Transaction.create(
        "  transaction-123  ",
        "  user-123  ",
        type,
        validAmount,
        validDescription
      );

      expect(transaction.id).toBe("transaction-123");
      expect(transaction.userId).toBe("user-123");
    });
  });

  describe("isIncome", () => {
    it("should return true for income transactions", () => {
      const type = TransactionTypeVO.createIncome();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription
      );

      expect(transaction.isIncome()).toBe(true);
    });

    it("should return false for expense transactions", () => {
      const type = TransactionTypeVO.createExpense();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription
      );

      expect(transaction.isIncome()).toBe(false);
    });
  });

  describe("isExpense", () => {
    it("should return true for expense transactions", () => {
      const type = TransactionTypeVO.createExpense();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription
      );

      expect(transaction.isExpense()).toBe(true);
    });

    it("should return false for income transactions", () => {
      const type = TransactionTypeVO.createIncome();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription
      );

      expect(transaction.isExpense()).toBe(false);
    });
  });

  describe("getFormattedAmount", () => {
    it("should format income with + prefix", () => {
      const type = TransactionTypeVO.createIncome();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription
      );

      expect(transaction.getFormattedAmount()).toBe("+R$ 100.50");
    });

    it("should format expense with - prefix", () => {
      const type = TransactionTypeVO.createExpense();
      const transaction = Transaction.create(
        validId,
        validUserId,
        type,
        validAmount,
        validDescription
      );

      expect(transaction.getFormattedAmount()).toBe("-R$ 100.50");
    });
  });
});
