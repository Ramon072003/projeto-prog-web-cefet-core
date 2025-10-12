import { MakeUserUserCase } from "../../factories/makeUserUseCase";

describe("makeUserUseCase", () => {
  it("should be run useCase", () => {
    const userCase = MakeUserUserCase();
    expect(userCase.registerUser).toBeDefined();
  });
});
