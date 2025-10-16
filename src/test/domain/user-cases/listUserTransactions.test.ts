import { ListUserTransactionsUseCase } from "../../../domain/user-cases/listUserTransactions";
import { CreateTransactionUseCase } from "../../../domain/user-cases/createTransaction";
import { MockTransactionRepository } from "../../../infra/mocks/MockTransactionRepository";
import { MockUserRepository } from "../../../infra/mocks/MockUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Name } from "../../../domain/value-objects/Name";
import { Password } from "../../../domain/value-objects/Password";

describe("ListUserTransactionsUseCase", () => {
  let listUseCase: ListUserTransactionsUseCase;
  let createUseCase: CreateTransactionUseCase;
  let transactionRepository: MockTransactionRepository;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    transactionRepository = new MockTransactionRepository();
    userRepository = MockUserRepository.getInstance();
    listUseCase = new ListUserTransactionsUseCase(
      transactionRepository,
      userRepository
    );
    createUseCase = new CreateTransactionUseCase(
      transactionRepository,
      userRepository
    );

    // Limpar repositórios
    transactionRepository.clear();
  });

  describe("execute", () => {
    it("should list all user transactions with correct totals", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      // Criar transações
      await createUseCase.execute({
        id: "income-1",
        userId,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      });

      await createUseCase.execute({
        id: "expense-1",
        userId,
        type: "EXPENSE",
        amount: 300.5,
        description: "Compras",
      });

      await createUseCase.execute({
        id: "income-2",
        userId,
        type: "INCOME",
        amount: 200.0,
        description: "Freelance",
      });

      // Act
      const result = await listUseCase.execute({ userId });

      // Assert
      expect(result.transactions).toHaveLength(3);
      expect(result.totalIncome).toBe(1200.0);
      expect(result.totalExpenses).toBe(300.5);
      expect(result.balance).toBe(899.5);
    });

    it("should list only income transactions when type filter is applied", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      await createUseCase.execute({
        id: "income-1",
        userId,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      });

      await createUseCase.execute({
        id: "expense-1",
        userId,
        type: "EXPENSE",
        amount: 300.5,
        description: "Compras",
      });

      // Act
      const result = await listUseCase.execute({ userId, type: "INCOME" });

      // Assert
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0]?.id).toBe("income-1");
      expect(result.totalIncome).toBe(1000.0);
      expect(result.totalExpenses).toBe(0);
      expect(result.balance).toBe(1000.0);
    });

    it("should list only expense transactions when type filter is applied", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      await createUseCase.execute({
        id: "income-1",
        userId,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      });

      await createUseCase.execute({
        id: "expense-1",
        userId,
        type: "EXPENSE",
        amount: 300.5,
        description: "Compras",
      });

      // Act
      const result = await listUseCase.execute({ userId, type: "EXPENSE" });

      // Assert
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0]?.id).toBe("expense-1");
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(300.5);
      expect(result.balance).toBe(-300.5);
    });

    it("should return empty list for user with no transactions", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      // Act
      const result = await listUseCase.execute({ userId });

      // Assert
      expect(result.transactions).toHaveLength(0);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.balance).toBe(0);
    });

    it("should throw error when user does not exist", async () => {
      // Act & Assert
      await expect(
        listUseCase.execute({ userId: "non-existent-user" })
      ).rejects.toThrow("User not found");
    });

    it("should not include transactions from other users", async () => {
      // Arrange
      const user1Id = "user-1";
      const user2Id = "user-2";

      const user1 = User.create(
        user1Id,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );

      const user2 = User.create(
        user2Id,
        Name.create("Maria Silva"),
        Email.create("maria@example.com"),
        Password.create("Password123!")
      );

      await userRepository.save(user1);
      await userRepository.save(user2);

      // Criar transações para user1
      await createUseCase.execute({
        id: "income-user1",
        userId: user1Id,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário User1",
      });

      // Criar transações para user2
      await createUseCase.execute({
        id: "income-user2",
        userId: user2Id,
        type: "INCOME",
        amount: 500.0,
        description: "Salário User2",
      });

      // Act
      const result = await listUseCase.execute({ userId: user1Id });

      // Assert
      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0]?.id).toBe("income-user1");
      expect(result.totalIncome).toBe(1000.0);
    });
  });
});
