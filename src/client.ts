export interface VenoPagOptions {
  clientId: string;
  clientSecret: string;
  webhookSecret?: string;
  baseURL?: string;
}

export interface BaseResponse {
  ok: boolean;
  error?: string;
}

let cryptoModule;

function getCrypto() {
  if (!cryptoModule) {
    try {
      cryptoModule = require("crypto");
    } catch {
      cryptoModule = globalThis.crypto || globalThis.msCrypto;
    }
  }
  return cryptoModule;
}

export class VenoPagClient {
  private clientId: string;
  private clientSecret: string;
  private webhookSecret?: string;
  private baseURL: string;

  constructor(options: VenoPagOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.webhookSecret = options.webhookSecret;
    this.baseURL = options.baseURL || "https://venopagments.com";
  }

  private async request<T>(
    endpoint: string,
    init: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-Client-Id": this.clientId,
      "X-Client-Secret": this.clientSecret,
      ...init.headers,
    } as Record<string, string>;

    const response = await fetch(url, {
      ...init,
      headers,
    });

    const data = (await response.json()) as T & { ok: boolean };

    // Always make business logic decisions based on the "ok" field,
    // never on HTTP status code (which is always 200 for business routes)
    if (!data.ok) {
      const errorCode = response.headers.get("X-App-Error-Code");
      const errorMessage = (data as any).error || "Unknown error";
      throw new VenoPagError(
        errorMessage,
        errorCode || String(response.status),
        data
      );
    }

    return data;
  }

  /**
   * Criar uma cobrança PIX (Cash In)
   */
  async criarCashin(
    amount: number,
    name?: string,
    document?: string,
    description?: string,
    webhookUrl?: string,
    splits?: Split[]
  ): Promise<CashInResponse> {
    return this.request<CashInResponse>("/api/cashin", {
      method: "POST",
      body: JSON.stringify({ amount, name, document, description, webhook_url: webhookUrl, splits }),
    });
  }

  /**
   * Consultar status da transação
   */
  async consultarStatus(requestNumber: string): Promise<ConsultTransactionResponse> {
    return this.request<ConsultTransactionResponse>(
      `/api/consult-transaction?request_number=${encodeURIComponent(requestNumber)}`
    );
  }

  /**
   * Consultar saldo da conta
   */
  async consultarSaldo(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>("/api/balance");
  }

  /**
   * Solicitar saque PIX (Cash Out)
   */
  async criarCashout(
    amount: number,
    name: string,
    document: string,
    pixKey: string,
    pixType: "EMAIL" | "CPF" | "CNPJ" | "EVP" | "QRCODE",
    webhookUrl: string,
    auto?: boolean,
    idempotencyKey?: string
  ): Promise<CashOutResponse> {
    return this.request<CashOutResponse>("/api/cashout", {
      method: "POST",
      body: JSON.stringify({ amount, name, document, pix_key: pixKey, pix_type: pixType, webhook_url: webhookUrl, auto, idempotency_key: idempotencyKey }),
    });
  }

  /**
   * Transferir entre contas da plataforma
   */
  async transferir(
    to: string,
    amount: number,
    externalId: string,
    description?: string
  ): Promise<TransferResponse> {
    return this.request<TransferResponse>("/api/transfer", {
      method: "POST",
      body: JSON.stringify({ to, amount, external_id: externalId, description }),
    });
  }

  /**
   * Verificar se a assinatura do webhook é válida
   */
  verifyWebhookSignature(
    signature: string,
    timestamp: string,
    body: string | Buffer
  ): boolean {
    if (!this.webhookSecret) {
      return false;
    }

    const t = timestamp;
    const bodyString =
      typeof body === "string" ? body : body.toString("utf8");

    // A assinatura vem no formato: t=1758600000,v1=81fd610a...
    // Precisamos extrair o v1 e comparar com HMAC-SHA256 de "<t>.<body>"
    const expectedHmac = this.hmacSha256(
      `${t}.${bodyString}`,
      this.webhookSecret
    );

    // A signature vem como "t=1758600000,v1=81fd610a..."
    // Extraímos o v1 após a vírgula
    const signatureMatch = signature.match(/v1=([a-f0-9]+)/i);
    if (!signatureMatch) return false;

    const receivedV1 = signatureMatch[1];
    return expectedHmac === receivedV1;
  }

  private hmacSha256(data: string, key: string): string {
    const crypto = getCrypto();
    return crypto.createHmac("sha256", key).update(data).digest("hex");
  }
}

export class VenoPagError extends Error {
  constructor(
    message: string,
    public errorCode: string,
    public rawResponse: any
  ) {
    super(message);
    this.name = "VenoPagError";
  }
}

export interface Split {
  username: string;
  percentage?: number;
  mode?: "percent" | "fixed" | "both";
  fixed?: number;
}

export interface CashInResponse extends BaseResponse {
  status: string;
  amount: number;
  request_number: string;
  transaction_id: string;
  copyPaste: string;
  qr_url: string;
  qr_img: string;
  checkout_url: string;
  expire_minutes: number;
  qr: string;
  copy_paste: string;
  code: string;
  pix_code: string;
  pix_qr_base64: string;
  transaction: string;
  e2e: string;
}

export interface CashOutResponse extends BaseResponse {
  e2e: string;
  fee: number;
  status: string;
  auto: boolean;
  transaction_id?: string;
}

export interface BalanceResponse extends BaseResponse {
  balance: {
    available: number;
    blocked: number;
    total: number;
    currency: string;
  };
  updated_at: string;
}

export interface ConsultTransactionResponse extends BaseResponse {
  type: "cashin";
  status: string;
  amount: number;
  fee: number;
  request_number: string;
  transaction_id: string;
  e2e: string;
  updated_at: string;
  expire_minutes: number;
  remaining: number;
}

export interface TransferResponse extends BaseResponse {
  e2e: string;
  status: string;
  amount: number;
  to_account: number;
  to: string;
  external_id: string;
}