import { CreateTransactionUseCase } from "../../../domain/user-cases/createTransaction";
import { MockTransactionRepository } from "../../../infra/mocks/MockTransactionRepository";
import { MockUserRepository } from "../../../infra/mocks/MockUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Name } from "../../../domain/value-objects/Name";
import { Password } from "../../../domain/value-objects/Password";

describe("CreateTransactionUseCase", () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: MockTransactionRepository;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    transactionRepository = new MockTransactionRepository();
    userRepository = MockUserRepository.getInstance();
    useCase = new CreateTransactionUseCase(
      transactionRepository,
      userRepository
    );

    // Limpar repositórios
    transactionRepository.clear();
  });

  describe("execute", () => {
    it("should create a valid income transaction", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      const input = {
        id: "transaction-123",
        userId,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      };

      // Act
      await useCase.execute(input);

      // Assert
      const savedTransaction = await transactionRepository.findById(input.id);
      expect(savedTransaction).toBeDefined();
      expect(savedTransaction!.id).toBe(input.id);
      expect(savedTransaction!.userId).toBe(input.userId);
      expect(savedTransaction!.type.toString()).toBe("INCOME");
      expect(savedTransaction!.amount.getValue()).toBe(1000.0);
      expect(savedTransaction!.description.toString()).toBe("Salário");
    });

    it("should create a valid expense transaction", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      const input = {
        id: "transaction-123",
        userId,
        type: "EXPENSE",
        amount: 50.75,
        description: "Compra no supermercado",
      };

      // Act
      await useCase.execute(input);

      // Assert
      const savedTransaction = await transactionRepository.findById(input.id);
      expect(savedTransaction).toBeDefined();
      expect(savedTransaction!.type.toString()).toBe("EXPENSE");
      expect(savedTransaction!.amount.getValue()).toBe(50.75);
    });

    it("should throw error when user does not exist", async () => {
      // Arrange
      const input = {
        id: "transaction-123",
        userId: "non-existent-user",
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow("User not found");
    });

    it("should throw error for invalid transaction type", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      const input = {
        id: "transaction-123",
        userId,
        type: "INVALID",
        amount: 1000.0,
        description: "Salário",
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        "Invalid transaction type. Must be INCOME or EXPENSE"
      );
    });

    it("should throw error for invalid amount", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      const input = {
        id: "transaction-123",
        userId,
        type: "INCOME",
        amount: -100.0,
        description: "Salário",
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        "Amount must be greater than zero"
      );
    });

    it("should throw error for invalid description", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      const input = {
        id: "transaction-123",
        userId,
        type: "INCOME",
        amount: 1000.0,
        description: "",
      };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        "Description cannot be empty"
      );
    });
  });
});
