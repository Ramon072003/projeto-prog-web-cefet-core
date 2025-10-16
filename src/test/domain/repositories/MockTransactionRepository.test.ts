import { MockTransactionRepository } from "../../../infra/mocks/MockTransactionRepository";
import { Transaction } from "../../../domain/entities/Transaction";
import { Amount } from "../../../domain/value-objects/Amount";
import { Description } from "../../../domain/value-objects/Description";
import { TransactionTypeVO } from "../../../domain/value-objects/TransactionType";

describe("MockTransactionRepository", () => {
  let repository: MockTransactionRepository;

  beforeEach(() => {
    repository = new MockTransactionRepository();
    repository.clear();
  });

  const createTestTransaction = (
    id: string = "transaction-1",
    userId: string = "user-1",
    type: "INCOME" | "EXPENSE" = "INCOME",
    amount: number = 100.0,
    description: string = "Test transaction"
  ) => {
    const transactionType =
      type === "INCOME"
        ? TransactionTypeVO.createIncome()
        : TransactionTypeVO.createExpense();

    return Transaction.create(
      id,
      userId,
      transactionType,
      Amount.create(amount),
      Description.create(description)
    );
  };

  describe("save", () => {
    it("should save a transaction", async () => {
      // Arrange
      const transaction = createTestTransaction();

      // Act
      await repository.save(transaction);

      // Assert
      const savedTransaction = await repository.findById(transaction.id);
      expect(savedTransaction).toBeDefined();
      expect(savedTransaction?.id).toBe(transaction.id);
    });

    it("should save multiple transactions", async () => {
      // Arrange
      const transaction1 = createTestTransaction("transaction-1");
      const transaction2 = createTestTransaction("transaction-2");

      // Act
      await repository.save(transaction1);
      await repository.save(transaction2);

      // Assert
      const allTransactions = repository.getAll();
      expect(allTransactions).toHaveLength(2);
    });
  });

  describe("findById", () => {
    it("should find transaction by ID", async () => {
      // Arrange
      const transaction = createTestTransaction("transaction-123");
      await repository.save(transaction);

      // Act
      const foundTransaction = await repository.findById("transaction-123");

      // Assert
      expect(foundTransaction).toBeDefined();
      expect(foundTransaction?.id).toBe("transaction-123");
    });

    it("should return null for non-existent transaction", async () => {
      // Act
      const foundTransaction = await repository.findById("non-existent");

      // Assert
      expect(foundTransaction).toBeNull();
    });
  });

  describe("findByUserId", () => {
    it("should find transactions by user ID", async () => {
      // Arrange
      const user1Transaction1 = createTestTransaction("t1", "user-1");
      const user1Transaction2 = createTestTransaction("t2", "user-1");
      const user2Transaction = createTestTransaction("t3", "user-2");

      await repository.save(user1Transaction1);
      await repository.save(user1Transaction2);
      await repository.save(user2Transaction);

      // Act
      const user1Transactions = await repository.findByUserId("user-1");

      // Assert
      expect(user1Transactions).toHaveLength(2);
      expect(user1Transactions.every((t) => t.userId === "user-1")).toBe(true);
    });

    it("should return empty array for user with no transactions", async () => {
      // Act
      const transactions = await repository.findByUserId(
        "user-without-transactions"
      );

      // Assert
      expect(transactions).toHaveLength(0);
    });
  });

  describe("findByUserIdAndType", () => {
    it("should find income transactions by user ID", async () => {
      // Arrange
      const incomeTransaction = createTestTransaction("t1", "user-1", "INCOME");
      const expenseTransaction = createTestTransaction(
        "t2",
        "user-1",
        "EXPENSE"
      );

      await repository.save(incomeTransaction);
      await repository.save(expenseTransaction);

      // Act
      const incomeTransactions = await repository.findByUserIdAndType(
        "user-1",
        "INCOME"
      );

      // Assert
      expect(incomeTransactions).toHaveLength(1);
      expect(incomeTransactions[0]?.type.toString()).toBe("INCOME");
    });

    it("should find expense transactions by user ID", async () => {
      // Arrange
      const incomeTransaction = createTestTransaction("t1", "user-1", "INCOME");
      const expenseTransaction = createTestTransaction(
        "t2",
        "user-1",
        "EXPENSE"
      );

      await repository.save(incomeTransaction);
      await repository.save(expenseTransaction);

      // Act
      const expenseTransactions = await repository.findByUserIdAndType(
        "user-1",
        "EXPENSE"
      );

      // Assert
      expect(expenseTransactions).toHaveLength(1);
      expect(expenseTransactions[0]?.type.toString()).toBe("EXPENSE");
    });

    it("should return empty array when no transactions match criteria", async () => {
      // Arrange
      const incomeTransaction = createTestTransaction("t1", "user-1", "INCOME");
      await repository.save(incomeTransaction);

      // Act
      const expenseTransactions = await repository.findByUserIdAndType(
        "user-1",
        "EXPENSE"
      );

      // Assert
      expect(expenseTransactions).toHaveLength(0);
    });
  });

  describe("update", () => {
    it("should update existing transaction", async () => {
      // Arrange
      const transaction = createTestTransaction();
      await repository.save(transaction);

      const updatedTransaction = Transaction.create(
        transaction.id,
        transaction.userId,
        TransactionTypeVO.createExpense(),
        Amount.create(200.0),
        Description.create("Updated description")
      );

      // Act
      await repository.update(updatedTransaction);

      // Assert
      const foundTransaction = await repository.findById(transaction.id);
      expect(foundTransaction?.type.toString()).toBe("EXPENSE");
      expect(foundTransaction?.amount.getValue()).toBe(200.0);
      expect(foundTransaction?.description.toString()).toBe(
        "Updated description"
      );
    });

    it("should not add new transaction when updating non-existent ID", async () => {
      // Arrange
      const transaction = createTestTransaction("non-existent");

      // Act
      await repository.update(transaction);

      // Assert
      const allTransactions = repository.getAll();
      expect(allTransactions).toHaveLength(0);
    });
  });

  describe("delete", () => {
    it("should delete existing transaction", async () => {
      // Arrange
      const transaction = createTestTransaction();
      await repository.save(transaction);

      // Verificar que existe
      let foundTransaction = await repository.findById(transaction.id);
      expect(foundTransaction).toBeDefined();

      // Act
      await repository.delete(transaction.id);

      // Assert
      foundTransaction = await repository.findById(transaction.id);
      expect(foundTransaction).toBeNull();
    });

    it("should not throw error when deleting non-existent transaction", async () => {
      // Act & Assert
      await expect(repository.delete("non-existent")).resolves.not.toThrow();
    });

    it("should only delete specified transaction", async () => {
      // Arrange
      const transaction1 = createTestTransaction("t1");
      const transaction2 = createTestTransaction("t2");

      await repository.save(transaction1);
      await repository.save(transaction2);

      // Act
      await repository.delete("t1");

      // Assert
      const foundTransaction1 = await repository.findById("t1");
      const foundTransaction2 = await repository.findById("t2");

      expect(foundTransaction1).toBeNull();
      expect(foundTransaction2).toBeDefined();
    });
  });

  describe("clear", () => {
    it("should clear all transactions", () => {
      // Arrange
      const transaction1 = createTestTransaction("t1");
      const transaction2 = createTestTransaction("t2");

      repository.save(transaction1);
      repository.save(transaction2);

      // Act
      repository.clear();

      // Assert
      const allTransactions = repository.getAll();
      expect(allTransactions).toHaveLength(0);
    });
  });
});
