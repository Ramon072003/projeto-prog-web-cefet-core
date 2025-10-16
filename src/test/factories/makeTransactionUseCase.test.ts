import { TransactionUseCaseFactory } from "../../factories/makeTransactionUseCase";
import { CreateTransactionUseCase } from "../../domain/user-cases/createTransaction";
import { ListUserTransactionsUseCase } from "../../domain/user-cases/listUserTransactions";
import { DeleteTransactionUseCase } from "../../domain/user-cases/deleteTransaction";
import { User } from "../../domain/entities/User";
import { Name } from "../../domain/value-objects/Name";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";

describe("TransactionUseCaseFactory", () => {
  describe("makeCreateTransactionUseCase", () => {
    it("should create CreateTransactionUseCase instance", () => {
      // Act
      const useCase = TransactionUseCaseFactory.makeCreateTransactionUseCase();

      // Assert
      expect(useCase).toBeInstanceOf(CreateTransactionUseCase);
    });

    it("should return same repository instances for consistency", () => {
      // Act
      const useCase1 = TransactionUseCaseFactory.makeCreateTransactionUseCase();
      const useCase2 = TransactionUseCaseFactory.makeCreateTransactionUseCase();

      // Assert - Ambos devem usar os mesmos repositórios (singleton pattern)
      const repo1 = TransactionUseCaseFactory.getTransactionRepository();
      const repo2 = TransactionUseCaseFactory.getTransactionRepository();

      expect(repo1).toBe(repo2);
    });
  });

  describe("makeListUserTransactionsUseCase", () => {
    it("should create ListUserTransactionsUseCase instance", () => {
      // Act
      const useCase =
        TransactionUseCaseFactory.makeListUserTransactionsUseCase();

      // Assert
      expect(useCase).toBeInstanceOf(ListUserTransactionsUseCase);
    });
  });

  describe("makeDeleteTransactionUseCase", () => {
    it("should create DeleteTransactionUseCase instance", () => {
      // Act
      const useCase = TransactionUseCaseFactory.makeDeleteTransactionUseCase();

      // Assert
      expect(useCase).toBeInstanceOf(DeleteTransactionUseCase);
    });
  });

  describe("repository getters", () => {
    it("should return transaction repository instance", () => {
      // Act
      const repository = TransactionUseCaseFactory.getTransactionRepository();

      // Assert
      expect(repository).toBeDefined();
      expect(typeof repository.save).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findByUserId).toBe("function");
    });

    it("should return user repository instance", () => {
      // Act
      const repository = TransactionUseCaseFactory.getUserRepository();

      // Assert
      expect(repository).toBeDefined();
      expect(typeof repository.save).toBe("function");
      expect(typeof repository.findById).toBe("function");
      expect(typeof repository.findByEmail).toBe("function");
    });
  });

  describe("integration test", () => {
    it("should create working use cases that share repositories", async () => {
      // Arrange
      const createUseCase =
        TransactionUseCaseFactory.makeCreateTransactionUseCase();
      const listUseCase =
        TransactionUseCaseFactory.makeListUserTransactionsUseCase();
      const deleteUseCase =
        TransactionUseCaseFactory.makeDeleteTransactionUseCase();

      // Limpar repositórios
      TransactionUseCaseFactory.getTransactionRepository().clear();

      // Criar um usuário de teste
      const userRepo = TransactionUseCaseFactory.getUserRepository();

      const user = User.create(
        "user-123",
        Name.create("João Silva"),
        Email.create("joao@example.com"),
        Password.create("Password123!")
      );
      await userRepo.save(user);

      // Act - Criar transação
      await createUseCase.execute({
        id: "transaction-123",
        userId: "user-123",
        type: "INCOME",
        amount: 1000.0,
        description: "Salário",
      });

      // Act - Listar transações
      const listResult = await listUseCase.execute({ userId: "user-123" });

      // Act - Deletar transação
      await deleteUseCase.execute({
        transactionId: "transaction-123",
        userId: "user-123",
      });

      // Act - Listar novamente
      const listResultAfterDelete = await listUseCase.execute({
        userId: "user-123",
      });

      // Assert
      expect(listResult.transactions).toHaveLength(1);
      expect(listResult.transactions[0]?.id).toBe("transaction-123");
      expect(listResultAfterDelete.transactions).toHaveLength(0);
    });
  });
});
