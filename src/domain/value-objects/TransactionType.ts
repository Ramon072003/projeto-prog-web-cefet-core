export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export class TransactionTypeVO {
  private constructor(private readonly type: TransactionType) {}

  static createIncome(): TransactionTypeVO {
    return new TransactionTypeVO(TransactionType.INCOME);
  }

  static createExpense(): TransactionTypeVO {
    return new TransactionTypeVO(TransactionType.EXPENSE);
  }

  static fromString(type: string): TransactionTypeVO {
    const upperType = type.toUpperCase();

    if (upperType === TransactionType.INCOME) {
      return TransactionTypeVO.createIncome();
    }

    if (upperType === TransactionType.EXPENSE) {
      return TransactionTypeVO.createExpense();
    }

    throw new Error("Invalid transaction type. Must be INCOME or EXPENSE");
  }

  getValue(): TransactionType {
    return this.type;
  }

  isIncome(): boolean {
    return this.type === TransactionType.INCOME;
  }

  isExpense(): boolean {
    return this.type === TransactionType.EXPENSE;
  }

  toString(): string {
    return this.type;
  }
}
