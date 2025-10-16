import { Transaction } from "../entities/Transaction";

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  findByUserId(userId: string): Promise<Transaction[]>;
  update(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  findByUserIdAndType(userId: string, type: string): Promise<Transaction[]>;
}
