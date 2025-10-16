export class Description {
  private constructor(private readonly value: string) {}

  static create(description: string): Description {
    if (!description || description.trim().length === 0) {
      throw new Error("Description cannot be empty");
    }

    if (description.trim().length > 255) {
      throw new Error("Description cannot exceed 255 characters");
    }

    return new Description(description.trim());
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
