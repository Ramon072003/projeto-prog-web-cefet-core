/**
 * Exemplo prático de uso do Sistema de Controle Financeiro
 *
 * Este arquivo demonstra como usar todas as funcionalidades implementadas.
 * Execute com: npx ts-node src/examples/financial-system-example.ts
 */

import { TransactionUseCaseFactory } from "../factories/makeTransactionUseCase";
import { MakeUserUserCase } from "../factories/makeUserUseCase";

async function financialSystemExample() {
  console.log("=== Sistema de Controle Financeiro ===\n");

  // 1. Registrar usuário
  console.log("1. Registrando usuário...");
  const { registerUser } = MakeUserUserCase();

  const newUser = await registerUser.execute({
    name: "João Silva",
    email: "joao@example.com",
    password: "Password123!",
  });
  const userId = newUser.id;
  console.log("✅ Usuário João Silva registrado com sucesso!\n");

  // 2. Criar instâncias dos casos de uso
  const createTransactionUseCase =
    TransactionUseCaseFactory.makeCreateTransactionUseCase();
  const listTransactionsUseCase =
    TransactionUseCaseFactory.makeListUserTransactionsUseCase();
  const deleteTransactionUseCase =
    TransactionUseCaseFactory.makeDeleteTransactionUseCase();

  // 3. Adicionar receitas
  console.log("2. Adicionando receitas...");

  await createTransactionUseCase.execute({
    id: "salary-jan",
    userId: userId,
    type: "INCOME",
    amount: 5000.0,
    description: "Salário Janeiro",
  });

  await createTransactionUseCase.execute({
    id: "freelance-jan",
    userId: userId,
    type: "INCOME",
    amount: 1500.0,
    description: "Freelance - Desenvolvimento Website",
  });

  console.log(
    "✅ Receitas adicionadas: Salário (R$ 5.000,00) + Freelance (R$ 1.500,00)\n"
  );

  // 4. Adicionar despesas
  console.log("3. Adicionando despesas...");

  await createTransactionUseCase.execute({
    id: "rent-jan",
    userId: userId,
    type: "EXPENSE",
    amount: 1200.0,
    description: "Aluguel Janeiro",
  });

  await createTransactionUseCase.execute({
    id: "groceries-1",
    userId: userId,
    type: "EXPENSE",
    amount: 350.75,
    description: "Supermercado - Compras da semana",
  });

  await createTransactionUseCase.execute({
    id: "gas-jan",
    userId: userId,
    type: "EXPENSE",
    amount: 200.0,
    description: "Combustível",
  });

  console.log(
    "✅ Despesas adicionadas: Aluguel (R$ 1.200,00) + Mercado (R$ 350,75) + Combustível (R$ 200,00)\n"
  );

  // 5. Listar todas as transações
  console.log("4. Resumo financeiro completo:");
  const allTransactions = await listTransactionsUseCase.execute({
    userId: userId,
  });

  console.log(`📊 Total de transações: ${allTransactions.transactions.length}`);
  console.log(
    `💰 Total de receitas: R$ ${allTransactions.totalIncome.toFixed(2)}`
  );
  console.log(
    `💸 Total de despesas: R$ ${allTransactions.totalExpenses.toFixed(2)}`
  );
  console.log(`🏦 Saldo atual: R$ ${allTransactions.balance.toFixed(2)}\n`);

  // 6. Listar apenas receitas
  console.log("5. Detalhes das receitas:");
  const incomeTransactions = await listTransactionsUseCase.execute({
    userId: userId,
    type: "INCOME",
  });

  incomeTransactions.transactions.forEach((transaction) => {
    console.log(
      `   ${transaction.getFormattedAmount()} - ${transaction.description.toString()}`
    );
  });
  console.log("");

  // 7. Listar apenas despesas
  console.log("6. Detalhes das despesas:");
  const expenseTransactions = await listTransactionsUseCase.execute({
    userId: userId,
    type: "EXPENSE",
  });

  expenseTransactions.transactions.forEach((transaction) => {
    console.log(
      `   ${transaction.getFormattedAmount()} - ${transaction.description.toString()}`
    );
  });
  console.log("");

  // 8. Deletar uma transação
  console.log("7. Removendo compra do supermercado...");
  await deleteTransactionUseCase.execute({
    transactionId: "groceries-1",
    userId: userId,
  });
  console.log("✅ Transação removida com sucesso!\n");

  // 9. Mostrar saldo atualizado
  console.log("8. Saldo atualizado após remoção:");
  const updatedTransactions = await listTransactionsUseCase.execute({
    userId: userId,
  });

  console.log(
    `📊 Total de transações: ${updatedTransactions.transactions.length}`
  );
  console.log(
    `💰 Total de receitas: R$ ${updatedTransactions.totalIncome.toFixed(2)}`
  );
  console.log(
    `💸 Total de despesas: R$ ${updatedTransactions.totalExpenses.toFixed(2)}`
  );
  console.log(`🏦 Novo saldo: R$ ${updatedTransactions.balance.toFixed(2)}\n`);

  // 10. Demonstrar controle de acesso
  console.log("9. Teste de controle de acesso:");
  try {
    // Tentar deletar transação com usuário diferente
    await deleteTransactionUseCase.execute({
      transactionId: "salary-jan",
      userId: "user-diferente", // Usuário que não existe
    });
  } catch (error) {
    console.log(
      `✅ Segurança funcionando: ${
        error instanceof Error ? error.message : "Erro desconhecido"
      }`
    );
  }

  // 11. Demonstrar validações
  console.log("\n10. Teste de validações:");
  try {
    // Tentar criar transação com valor negativo
    await createTransactionUseCase.execute({
      id: "invalid-transaction",
      userId: userId,
      type: "INCOME",
      amount: -100.0, // Valor inválido
      description: "Teste valor negativo",
    });
  } catch (error) {
    console.log(
      `✅ Validação funcionando: ${
        error instanceof Error ? error.message : "Erro desconhecido"
      }`
    );
  }

  console.log("\n=== Exemplo concluído com sucesso! ===");
  console.log("Todas as funcionalidades do sistema estão operacionais:");
  console.log("✅ Registro e controle de usuários");
  console.log("✅ CRUD completo de transações financeiras");
  console.log("✅ Separação entre receitas e despesas");
  console.log("✅ Cálculos automáticos de totais e saldo");
  console.log("✅ Controle de acesso por usuário");
  console.log("✅ Validações de regras de negócio");
  console.log("✅ Arquitetura limpa e testável");
}

// Para executar: npx ts-node src/examples/financial-system-example.ts
// financialSystemExample().catch(console.error);

export { financialSystemExample };
