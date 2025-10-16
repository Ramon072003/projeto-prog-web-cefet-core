import { Transaction } from "../entities/Transaction";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export interface ListUserTransactionsInput {
  userId: string;
  type?: string;
}

export interface ListUserTransactionsOutput {
  transactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export class ListUserTransactionsUseCase {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(
    input: ListUserTransactionsInput
  ): Promise<ListUserTransactionsOutput> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Buscar transações
    let transactions: Transaction[];

    if (input.type) {
      transactions = await this.transactionRepository.findByUserIdAndType(
        input.userId,
        input.type
      );
    } else {
      transactions = await this.transactionRepository.findByUserId(
        input.userId
      );
    }

    // Calcular totais
    const incomeTransactions = transactions.filter((t) => t.isIncome());
    const expenseTransactions = transactions.filter((t) => t.isExpense());

    const totalIncome = incomeTransactions.reduce(
      (sum, t) => sum + t.amount.getValue(),
      0
    );

    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + t.amount.getValue(),
      0
    );

    const balance = totalIncome - totalExpenses;

    return {
      transactions,
      totalIncome,
      totalExpenses,
      balance,
    };
  }
}
