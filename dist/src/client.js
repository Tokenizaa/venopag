"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenoPagError = exports.VenoPagClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class VenoPagClient {
    constructor(options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.webhookSecret = options.webhookSecret;
        this.baseURL = options.baseURL || "https://venopagments.com";
    }
    async request(endpoint, init = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            "X-Client-Id": this.clientId,
            "X-Client-Secret": this.clientSecret,
            ...init.headers,
        };
        const response = await (0, node_fetch_1.default)(url, {
            ...init,
            headers,
        });
        const data = (await response.json());
        // Always make business logic decisions based on the "ok" field,
        // never on HTTP status code (which is always 200 for business routes)
        if (!data.ok) {
            const errorCode = response.headers.get("X-App-Error-Code");
            const errorMessage = data.error || "Unknown error";
            throw new VenoPagError(errorMessage, errorCode || String(response.status), data);
        }
        return data;
    }
    /**
     * Criar uma cobrança PIX (Cash In)
     */
    async criarCashin(amount, name, document, description, webhookUrl, splits) {
        return this.request("/api/cashin", {
            method: "POST",
            body: JSON.stringify({ amount, name, document, description, webhook_url: webhookUrl, splits }),
        });
    }
    /**
     * Consultar status da transação
     */
    async consultarStatus(requestNumber) {
        return this.request(`/api/consult-transaction?request_number=${encodeURIComponent(requestNumber)}`);
    }
    /**
     * Consultar saldo da conta
     */
    async consultarSaldo() {
        return this.request("/api/balance");
    }
    /**
     * Solicitar saque PIX (Cash Out)
     */
    async criarCashout(amount, name, document, pixKey, pixType, webhookUrl, auto, idempotencyKey) {
        return this.request("/api/cashout", {
            method: "POST",
            body: JSON.stringify({ amount, name, document, pix_key: pixKey, pix_type: pixType, webhook_url: webhookUrl, auto, idempotency_key: idempotencyKey }),
        });
    }
    /**
     * Transferir entre contas da plataforma
     */
    async transferir(to, amount, externalId, description) {
        return this.request("/api/transfer", {
            method: "POST",
            body: JSON.stringify({ to, amount, external_id: externalId, description }),
        });
    }
    /**
     * Verificar se a assinatura do webhook é válida
     */
    verifyWebhookSignature(signature, timestamp, body) {
        if (!this.webhookSecret) {
            return false;
        }
        const t = timestamp;
        const bodyString = typeof body === "string" ? body : body.toString("utf8");
        // A assinatura vem no formato: t=1758600000,v1=81fd610a...
        // Precisamos extrair o v1 e comparar com HMAC-SHA256 de "<t>.<body>"
        const expectedHmac = this.hmacSha256(`${t}.${bodyString}`, this.webhookSecret);
        // A signature vem como "t=1758600000,v1=81fd610a..."
        // Extraímos o v1 após a vírgula
        const signatureMatch = signature.match(/v1=([a-f0-9]+)/i);
        if (!signatureMatch)
            return false;
        const receivedV1 = signatureMatch[1];
        return expectedHmac === receivedV1;
    }
    hmacSha256(data, key) {
        const crypto = require("crypto");
        return crypto.createHmac("sha256", key).update(data).digest("hex");
    }
}
exports.VenoPagClient = VenoPagClient;
class VenoPagError extends Error {
    constructor(message, errorCode, rawResponse) {
        super(message);
        this.errorCode = errorCode;
        this.rawResponse = rawResponse;
        this.name = "VenoPagError";
    }
}
exports.VenoPagError = VenoPagError;
