export class Amount {
  private constructor(private readonly value: number) {}

  static create(value: number): Amount {
    if (value <= 0) {
      throw new Error("Amount must be greater than zero");
    }

    if (!Number.isFinite(value)) {
      throw new Error("Amount must be a valid number");
    }

    return new Amount(Math.round(value * 100) / 100); // Arredonda para 2 casas decimais
  }

  getValue(): number {
    return this.value;
  }

  toString(): string {
    return this.value.toFixed(2);
  }
}
