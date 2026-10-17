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
export declare class VenoPagClient {
    private clientId;
    private clientSecret;
    private webhookSecret?;
    private baseURL;
    constructor(options: VenoPagOptions);
    private request;
    /**
     * Criar uma cobrança PIX (Cash In)
     */
    criarCashin(amount: number, name?: string, document?: string, description?: string, webhookUrl?: string, splits?: Split[]): Promise<CashInResponse>;
    /**
     * Consultar status da transação
     */
    consultarStatus(requestNumber: string): Promise<ConsultTransactionResponse>;
    /**
     * Consultar saldo da conta
     */
    consultarSaldo(): Promise<BalanceResponse>;
    /**
     * Solicitar saque PIX (Cash Out)
     */
    criarCashout(amount: number, name: string, document: string, pixKey: string, pixType: "EMAIL" | "CPF" | "CNPJ" | "EVP" | "QRCODE", webhookUrl: string, auto?: boolean, idempotencyKey?: string): Promise<CashOutResponse>;
    /**
     * Transferir entre contas da plataforma
     */
    transferir(to: string, amount: number, externalId: string, description?: string): Promise<TransferResponse>;
    /**
     * Verificar se a assinatura do webhook é válida
     */
    verifyWebhookSignature(signature: string, timestamp: string, body: string | Buffer): boolean;
    private hmacSha256;
}
export declare class VenoPagError extends Error {
    errorCode: string;
    rawResponse: any;
    constructor(message: string, errorCode: string, rawResponse: any);
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
//# sourceMappingURL=client.d.ts.map