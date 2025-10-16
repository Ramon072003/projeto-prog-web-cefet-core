import { Amount } from "../value-objects/Amount";
import { Description } from "../value-objects/Description";
import { TransactionTypeVO } from "../value-objects/TransactionType";

export class Transaction {
  private constructor(
    readonly id: string,
    readonly userId: string,
    readonly type: TransactionTypeVO,
    readonly amount: Amount,
    readonly description: Description,
    readonly createdAt: Date
  ) {}

  static create(
    id: string,
    userId: string,
    type: TransactionTypeVO,
    amount: Amount,
    description: Description,
    createdAt?: Date
  ): Transaction {
    if (!id || id.trim().length === 0) {
      throw new Error("Transaction ID cannot be empty");
    }

    if (!userId || userId.trim().length === 0) {
      throw new Error("User ID cannot be empty");
    }

    return new Transaction(
      id.trim(),
      userId.trim(),
      type,
      amount,
      description,
      createdAt || new Date()
    );
  }

  isIncome(): boolean {
    return this.type.isIncome();
  }

  isExpense(): boolean {
    return this.type.isExpense();
  }

  getFormattedAmount(): string {
    const prefix = this.isIncome() ? "+" : "-";
    return `${prefix}R$ ${this.amount.toString()}`;
  }
}
