import { Transaction } from "../entities/Transaction";
import { Amount } from "../value-objects/Amount";
import { Description } from "../value-objects/Description";
import { TransactionTypeVO } from "../value-objects/TransactionType";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export interface CreateTransactionInput {
  id: string;
  userId: string;
  type: string;
  amount: number;
  description: string;
}

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: CreateTransactionInput): Promise<void> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Criar value objects
    const type = TransactionTypeVO.fromString(input.type);
    const amount = Amount.create(input.amount);
    const description = Description.create(input.description);

    // Criar transação
    const transaction = Transaction.create(
      input.id,
      input.userId,
      type,
      amount,
      description
    );

    // Salvar transação
    await this.transactionRepository.save(transaction);
  }
}
