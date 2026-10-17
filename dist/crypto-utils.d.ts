export declare function hmacSha256(data: string, key: string): string;
export declare function parseWebhookSignature(signature: string): {
    timestamp: string;
    v1: string;
} | null;
export declare function verifyWebhookSignature(signature: string, timestamp: string, body: string | Buffer, webhookSecret: string): boolean;
export declare function hmacSha256ToHex(data: string, key: string): string;
//# sourceMappingURL=crypto-utils.d.ts.map