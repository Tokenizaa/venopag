// Example de uso do plugin VenoPag
// Este arquivo demonstra como usar o cliente em um projeto Node.js

// Importa o cliente usando require (CommonJS)
const { VenoPagClient } = require("./client");

// Inicialize o cliente com suas credenciais
const client = new VenoPagClient({
  clientId: "SEU_CLIENT_ID",
  clientSecret: "SEU_CLIENT_SECRET",
  // webhookSecret deve ser configurado para verificação de webhooks
  // webhookSecret: "seu_segredo_webhook",
});

// Exemplo 1: Criar uma cobrança PIX (Cash In)
async function exemploCashIn() {
  try {
    const response = await client.criarCashin(
      150.00,
      "Cliente Teste",
      "12345678901",
      "Pedido #123",
      "https://seusistema.com/webhooks/venopag",
      [
        { username: "usuario1", percentage: 10 },
        { username: "usuario2", percentage: 5, mode: "fixed", fixed: 5.00 },
      ]
    );

    console.log("✅ Cobrança criada com sucesso!");
    console.log("   - request_number:", response.request_number);
    console.log("   - status:", response.status);
    console.log("   - qr_url:", response.qr_url);
    console.log("   - copyPaste:", response.copyPaste);
    console.log("   - expire_minutes:", response.expire_minutes);
  } catch (error) {
    if (error && error.errorCode) {
      console.error("❌ Erro na cobrança:");
      console.error("   - Código:", error.errorCode);
      console.error("   - Mensagem:", error.message);
      console.error("   - Resposta:", JSON.stringify(error.rawResponse));
    } else {
      console.error("❌ Erro inesperado:", error);
    }
  }
}

// Exemplo 2: Consultar status da transação
async function exemploConsultarStatus() {
  try {
    const response = await client.consultarStatus("veo_abc123def456");

    console.log("✅ Status da consulta:");
    console.log("   - type:", response.type);
    console.log("   - status:", response.status);
    console.log("   - amount:", response.amount);
    console.log("   - fee:", response.fee);
    console.log("   - remaining:", response.remaining, "minutos");
  } catch (error) {
    if (error && error.errorCode) {
      console.error("❌ Erro na consulta:", error.errorCode, "-", error.message);
    } else {
      console.error("❌ Erro inesperado:", error);
    }
  }
}

// Exemplo 3: Consultar saldo
async function exemploSaldo() {
  try {
    const response = await client.consultarSaldo();

    console.log("✅ Saldo da conta:");
    console.log("   - available:", response.balance.available);
    console.log("   - blocked:", response.balance.blocked);
    console.log("   - total:", response.balance.total);
    console.log("   - currency:", response.balance.currency);
    console.log("   - updated_at:", response.updated_at);
  } catch (error) {
    if (error && error.errorCode) {
      console.error("❌ Erro ao consultar saldo:", error.errorCode, "-", error.message);
    } else {
      console.error("❌ Erro inesperado:", error);
    }
  }
}

// Exemplo 4: Solicitar saque PIX (Cash Out)
async function exemploCashOut() {
  try {
    const response = await client.criarCashout(
      100.00,
      "Nome do Beneficiário",
      "12345678901",
      "fulano@banco.com",
      "EMAIL",
      "https://seusistema.com/webhooks/venopag",
      false,
      "idempotente-unique-123"
    );

    console.log("✅ Saque criado com sucesso!");
    console.log("   - e2e:", response.e2e);
    console.log("   - status:", response.status);
    console.log("   - fee:", response.fee);
    console.log("   - auto:", response.auto);
  } catch (error) {
    if (error && error.errorCode) {
      console.error("❌ Erro no saque:");
      console.error("   - Código:", error.errorCode);
      console.error("   - Mensagem:", error.message);
      console.error("   - Resposta:", JSON.stringify(error.rawResponse));
    } else {
      console.error("❌ Erro inesperado:", error);
    }
  }
}

// Exemplo 5: Transferir entre contas
async function exemploTransferir() {
  try {
    const response = await client.transferir(
      "loja_parceira",
      250.00,
      "repasse-1001",
      "Repasse semanal"
    );

    console.log("✅ Transferência criada com sucesso!");
    console.log("   - e2e:", response.e2e);
    console.log("   - status:", response.status);
    console.log("   - amount:", response.amount);
    console.log("   - to:", response.to);
    console.log("   - external_id:", response.external_id);
  } catch (error) {
    if (error && error.errorCode) {
      console.error("❌ Erro na transferência:");
      console.error("   - Código:", error.errorCode);
      console.error("   - Mensagem:", error.message);
      console.error("   - Resposta:", JSON.stringify(error.rawResponse));
    } else {
      console.error("❌ Erro inesperado:", error);
    }
  }
}

// Executar todos os exemplos
async function main() {
  console.log("=== Exemplo 1: Criar Cobrança PIX ===\n");
  await exemploCashIn();

  console.log("\n=== Exemplo 2: Consultar Status ===\n");
  await exemploConsultarStatus();

  console.log("\n=== Exemplo 3: Consultar Saldo ===\n");
  await exemploSaldo();

  console.log("\n=== Exemplo 4: Solicitar Saque PIX ===\n");
  await exemploCashOut();

  console.log("\n=== Exemplo 5: Transferir Entre Contas ===\n");
  await exemploTransferir();
}

main().catch(console.error);