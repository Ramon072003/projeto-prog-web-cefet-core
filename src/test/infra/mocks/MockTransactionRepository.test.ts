import { MockTransactionRepository } from "../../../infra/mocks/MockTransactionRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
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

  it("should implement ITransactionRepository interface", () => {
    // Assert
    expect(repository).toBeInstanceOf(MockTransactionRepository);

    // Verificar se implementa todos os métodos da interface
    const interfaceMethods: (keyof ITransactionRepository)[] = [
      "save",
      "findById",
      "findByUserId",
      "update",
      "delete",
      "findByUserIdAndType",
    ];

    interfaceMethods.forEach((method) => {
      expect(typeof repository[method]).toBe("function");
    });
  });

  it("should start with empty repository", () => {
    // Assert
    const allTransactions = repository.getAll();
    expect(allTransactions).toHaveLength(0);
  });

  it("should provide helper methods for testing", () => {
    // Assert
    expect(typeof repository.clear).toBe("function");
    expect(typeof repository.getAll).toBe("function");
  });

  it("should maintain data consistency across operations", async () => {
    // Arrange
    const transaction1 = Transaction.create(
      "t1",
      "user-1",
      TransactionTypeVO.createIncome(),
      Amount.create(100.0),
      Description.create("Income 1")
    );

    const transaction2 = Transaction.create(
      "t2",
      "user-1",
      TransactionTypeVO.createExpense(),
      Amount.create(50.0),
      Description.create("Expense 1")
    );

    // Act - Save transactions
    await repository.save(transaction1);
    await repository.save(transaction2);

    // Assert - Check they were saved
    expect(repository.getAll()).toHaveLength(2);

    // Act - Find by user
    const userTransactions = await repository.findByUserId("user-1");
    expect(userTransactions).toHaveLength(2);

    // Act - Find by type
    const incomeTransactions = await repository.findByUserIdAndType(
      "user-1",
      "INCOME"
    );
    const expenseTransactions = await repository.findByUserIdAndType(
      "user-1",
      "EXPENSE"
    );

    expect(incomeTransactions).toHaveLength(1);
    expect(expenseTransactions).toHaveLength(1);

    // Act - Delete one transaction
    await repository.delete("t1");

    // Assert - Check only one remains
    expect(repository.getAll()).toHaveLength(1);
    const remainingTransaction = await repository.findById("t2");
    expect(remainingTransaction).toBeDefined();
    expect(remainingTransaction?.id).toBe("t2");
  });

  it("should handle concurrent operations correctly", async () => {
    // Arrange
    const transactions = Array.from({ length: 10 }, (_, i) =>
      Transaction.create(
        `transaction-${i}`,
        "user-1",
        i % 2 === 0
          ? TransactionTypeVO.createIncome()
          : TransactionTypeVO.createExpense(),
        Amount.create((i + 1) * 10),
        Description.create(`Transaction ${i}`)
      )
    );

    // Act - Save all transactions concurrently
    await Promise.all(transactions.map((t) => repository.save(t)));

    // Assert
    expect(repository.getAll()).toHaveLength(10);

    // Act - Find all by user
    const userTransactions = await repository.findByUserId("user-1");
    expect(userTransactions).toHaveLength(10);

    // Act - Find by type
    const incomeTransactions = await repository.findByUserIdAndType(
      "user-1",
      "INCOME"
    );
    const expenseTransactions = await repository.findByUserIdAndType(
      "user-1",
      "EXPENSE"
    );

    expect(incomeTransactions).toHaveLength(5);
    expect(expenseTransactions).toHaveLength(5);
  });
});
