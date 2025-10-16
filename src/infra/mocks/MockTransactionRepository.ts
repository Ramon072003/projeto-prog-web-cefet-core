import { Transaction } from "../../domain/entities/Transaction";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";

export class MockTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.find((t) => t.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.transactions.filter((t) => t.userId === userId);
  }

  async update(transaction: Transaction): Promise<void> {
    const index = this.transactions.findIndex((t) => t.id === transaction.id);
    if (index >= 0) {
      this.transactions[index] = transaction;
    }
  }

  async delete(id: string): Promise<void> {
    this.transactions = this.transactions.filter((t) => t.id !== id);
  }

  async findByUserIdAndType(
    userId: string,
    type: string
  ): Promise<Transaction[]> {
    return this.transactions.filter(
      (t) => t.userId === userId && t.type.toString() === type.toUpperCase()
    );
  }

  // Método auxiliar para testes
  clear(): void {
    this.transactions = [];
  }

  // Método auxiliar para testes
  getAll(): Transaction[] {
    return [...this.transactions];
  }
}
