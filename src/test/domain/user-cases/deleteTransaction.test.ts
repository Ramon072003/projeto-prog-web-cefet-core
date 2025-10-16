import { DeleteTransactionUseCase } from "../../../domain/user-cases/deleteTransaction";
import { CreateTransactionUseCase } from "../../../domain/user-cases/createTransaction";
import { MockTransactionRepository } from "../../../infra/mocks/MockTransactionRepository";
import { MockUserRepository } from "../../../infra/mocks/MockUserRepository";
import { User } from "../../../domain/entities/User";
import { Email } from "../../../domain/value-objects/Email";
import { Name } from "../../../domain/value-objects/Name";
import { Password } from "../../../domain/value-objects/Password";

describe("DeleteTransactionUseCase", () => {
  let deleteUseCase: DeleteTransactionUseCase;
  let createUseCase: CreateTransactionUseCase;
  let transactionRepository: MockTransactionRepository;
  let userRepository: MockUserRepository;

  beforeEach(() => {
    transactionRepository = new MockTransactionRepository();
    userRepository = MockUserRepository.getInstance();
    deleteUseCase = new DeleteTransactionUseCase(
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
    it("should delete a transaction successfully", async () => {
      // Arrange
      const userId = "user-123";
      const transactionId = "transaction-123";

      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      await createUseCase.execute({
        id: transactionId,
        userId,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      });

      // Verificar que a transação existe
      let transaction = await transactionRepository.findById(transactionId);
      expect(transaction).toBeDefined();

      // Act
      await deleteUseCase.execute({ transactionId, userId });

      // Assert
      transaction = await transactionRepository.findById(transactionId);
      expect(transaction).toBeNull();
    });

    it("should throw error when user does not exist", async () => {
      // Act & Assert
      await expect(
        deleteUseCase.execute({
          transactionId: "transaction-123",
          userId: "non-existent-user",
        })
      ).rejects.toThrow("User not found");
    });

    it("should throw error when transaction does not exist", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      // Act & Assert
      await expect(
        deleteUseCase.execute({
          transactionId: "non-existent-transaction",
          userId,
        })
      ).rejects.toThrow("Transaction not found");
    });

    it("should throw error when trying to delete another user's transaction", async () => {
      // Arrange
      const user1Id = "user-1";
      const user2Id = "user-2";
      const transactionId = "transaction-123";

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

      // Criar transação para user1
      await createUseCase.execute({
        id: transactionId,
        userId: user1Id,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      });

      // Act & Assert - user2 tenta deletar transação do user1
      await expect(
        deleteUseCase.execute({
          transactionId,
          userId: user2Id,
        })
      ).rejects.toThrow("Transaction does not belong to the user");
    });

    it("should not affect other transactions when deleting one", async () => {
      // Arrange
      const userId = "user-123";
      const user = User.create(
        userId,
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepository.save(user);

      // Criar múltiplas transações
      await createUseCase.execute({
        id: "transaction-1",
        userId,
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      });

      await createUseCase.execute({
        id: "transaction-2",
        userId,
        type: "EXPENSE",
        amount: 300.0,
        description: "Compras",
      });

      // Act - Deletar apenas uma transação
      await deleteUseCase.execute({
        transactionId: "transaction-1",
        userId,
      });

      // Assert
      const deletedTransaction = await transactionRepository.findById(
        "transaction-1"
      );
      const remainingTransaction = await transactionRepository.findById(
        "transaction-2"
      );

      expect(deletedTransaction).toBeNull();
      expect(remainingTransaction).toBeDefined();
      expect(remainingTransaction?.description.toString()).toBe("Compras");
    });
  });
});
