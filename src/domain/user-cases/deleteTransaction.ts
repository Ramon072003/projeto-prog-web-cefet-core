import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export interface DeleteTransactionInput {
  transactionId: string;
  userId: string;
}

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: DeleteTransactionInput): Promise<void> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verificar se a transação existe
    const transaction = await this.transactionRepository.findById(
      input.transactionId
    );
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Verificar se a transação pertence ao usuário
    if (transaction.userId !== input.userId) {
      throw new Error("Transaction does not belong to the user");
    }

    // Deletar transação
    await this.transactionRepository.delete(input.transactionId);
  }
}
