import { CreateTransactionUseCase } from "../domain/user-cases/createTransaction";
import { ListUserTransactionsUseCase } from "../domain/user-cases/listUserTransactions";
import { DeleteTransactionUseCase } from "../domain/user-cases/deleteTransaction";
import { MockTransactionRepository } from "../infra/mocks/MockTransactionRepository";
import { MockUserRepository } from "../infra/mocks/MockUserRepository";

export class TransactionUseCaseFactory {
  private static transactionRepository = new MockTransactionRepository();
  private static userRepository = MockUserRepository.getInstance();

  static makeCreateTransactionUseCase(): CreateTransactionUseCase {
    return new CreateTransactionUseCase(
      this.transactionRepository,
      this.userRepository
    );
  }

  static makeListUserTransactionsUseCase(): ListUserTransactionsUseCase {
    return new ListUserTransactionsUseCase(
      this.transactionRepository,
      this.userRepository
    );
  }

  static makeDeleteTransactionUseCase(): DeleteTransactionUseCase {
    return new DeleteTransactionUseCase(
      this.transactionRepository,
      this.userRepository
    );
  }

  // Método auxiliar para testes
  static getTransactionRepository(): MockTransactionRepository {
    return this.transactionRepository;
  }

  // Método auxiliar para testes
  static getUserRepository(): MockUserRepository {
    return this.userRepository;
  }
}
