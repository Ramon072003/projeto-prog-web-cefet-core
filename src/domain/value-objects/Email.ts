export class Email {
  private constructor(readonly value: string) {}

  static create(email: string) {
    if (!this.validade(email)) {
      throw new Error("E-mail invalido");
    }

    return new Email(email);
  }

  private static validade(email: string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
    return emailRegex.test(email);
  }
}
