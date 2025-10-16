import {
  TransactionType,
  TransactionTypeVO,
} from "../../../domain/value-objects/TransactionType";

describe("TransactionTypeVO", () => {
  describe("createIncome", () => {
    it("should create income transaction type", () => {
      const type = TransactionTypeVO.createIncome();
      expect(type.getValue()).toBe(TransactionType.INCOME);
      expect(type.isIncome()).toBe(true);
      expect(type.isExpense()).toBe(false);
    });
  });

  describe("createExpense", () => {
    it("should create expense transaction type", () => {
      const type = TransactionTypeVO.createExpense();
      expect(type.getValue()).toBe(TransactionType.EXPENSE);
      expect(type.isIncome()).toBe(false);
      expect(type.isExpense()).toBe(true);
    });
  });

  describe("fromString", () => {
    it("should create income from string", () => {
      const type = TransactionTypeVO.fromString("income");
      expect(type.getValue()).toBe(TransactionType.INCOME);
    });

    it("should create expense from string", () => {
      const type = TransactionTypeVO.fromString("expense");
      expect(type.getValue()).toBe(TransactionType.EXPENSE);
    });

    it("should handle uppercase strings", () => {
      const incomeType = TransactionTypeVO.fromString("INCOME");
      const expenseType = TransactionTypeVO.fromString("EXPENSE");

      expect(incomeType.getValue()).toBe(TransactionType.INCOME);
      expect(expenseType.getValue()).toBe(TransactionType.EXPENSE);
    });

    it("should throw error for invalid type", () => {
      expect(() => TransactionTypeVO.fromString("invalid")).toThrow(
        "Invalid transaction type. Must be INCOME or EXPENSE"
      );
    });
  });

  describe("toString", () => {
    it("should return string representation", () => {
      const incomeType = TransactionTypeVO.createIncome();
      const expenseType = TransactionTypeVO.createExpense();

      expect(incomeType.toString()).toBe("INCOME");
      expect(expenseType.toString()).toBe("EXPENSE");
    });
  });
});
