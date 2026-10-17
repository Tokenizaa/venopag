# VenoPag SDK

SDK oficial para integração com a API VenoPag - pagamentos PIX, saques e transferências entre contas da plataforma.

## Instalação

```bash
npm install venopag
# ou
yarn add venopag
```

## Uso Básico

```javascript
const { VenoPagClient } = require('venopag');

const client = new VenoPagClient({
  clientId: 'SEU_CLIENT_ID',
  clientSecret: 'SEU_CLIENT_SECRET',
});

// Criar uma cobrança PIX (Cash In)
async function exemplo() {
  const response = await client.criarCashin(
    150.00,
    'Cliente Teste',
    '12345678901',
    'Pedido #123',
    'https://seusistema.com/webhooks/venopag'
  );
  
  console.log('✅ Cobrança criada!');
  console.log('   - request_number:', response.request_number);
  console.log('   - status:', response.status);
  console.log('   - qr_url:', response.qr_url);
}
```

## Métodos Disponíveis

### Criar Cobrança (Cash In)
```javascript
client.criarCashin(amount, name?, document?, description?, webhookUrl?, splits?)
```
- `amount`: valor em reais (obrigatório)
- `name`: nome do cliente (opcional)
- `document`: CPF/CNPJ do pagador (opcional, mas recomendado enviar sempre)
- `description`: descrição do pedido (opcional)
- `webhookUrl`: URL para receber notificações de status (opcional)
- `splits`: divisão de comissões (opcional)

### Consultar Status da Transação
```javascript
client.consultarStatus(requestNumber)
```
- `requestNumber`: número do pedido ou transaction_id

### Consultar Saldo da Conta
```javascript
client.consultarSaldo()
```
- Retorna objeto com `available`, `blocked`, `total` e `currency`

### Solicitar Saque (Cash Out)
```javascript
client.criarCashout(amount, name, document, pixKey, pixType, webhookUrl, auto?, idempotencyKey?)
```
- `pixType`: "EMAIL" | "CPF" | "CNPJ" | "EVP" | "QRCODE"
- `auto`: booleano (opcional)
- `idempotencyKey`: chave de idempotência (opcional, recomendado)

### Transferir Entre Contas
```javascript
client.transferir(to, amount, externalId, description)
```
- `to`: username ou e-mail da conta destino
- `externalId`: identificador único para idempotência (opcional, mas recomendado)

## Webhooks

Para receber notificações de mudança de status, informe um `webhook_url` ao criar a cobrança. Os webhooks são assinados com HMAC-SHA256 no header `X-Veno-Signature`.

## Exemplos Completo

Para exemplos completos com interface gráfica, consulte o arquivo `dist/manage.html` que contém um painel de gestão com formulários para todas as operações.

## Estrutura do Projeto

```
venopag/
├── dist/           # Arquivos compilados (JS + types)
│   ├── index.js
│   ├── index.d.ts
│   ├── client.js
│   └── manage.html  # Painel de gestão
├── src/            # Fonte TypeScript
│   ├── client.ts
│   ├── crypto-utils.ts
│   ├── webhook.ts
│   ├── interfaces.ts
│   └── example.ts
├── package.json
├── tsconfig.json
└── README.md
```

## TypeScript

O pacote inclui definições de tipo em `dist/index.d.ts`. Para usar com TypeScript:

```typescript
import { VenoPagClient } from 'venopag';

const client: VenoPagClient = new VenoPagClient({
  clientId: 'SEU_CLIENT_ID',
  clientSecret: 'SEU_CLIENT_SECRET',
});
```

## Licença

ISC