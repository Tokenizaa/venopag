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

export function hmacSha256(data: string, key: string): string {
  const crypto = getCrypto();
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

export function parseWebhookSignature(signature: string): {
  timestamp: string;
  v1: string;
} | null {
  const match = signature.match(/t=(\d+),v1=([a-f0-9]+)/i);
  if (!match) return null;
  return {
    timestamp: match[1],
    v1: match[2],
  };
}

export function verifyWebhookSignature(
  signature: string,
  timestamp: string,
  body: string | Buffer,
  webhookSecret: string
): boolean {
  const t = timestamp;
  const bodyString =
    typeof body === "string" ? body : body.toString("utf8");

  const expectedHmac = hmacSha256(`${t}.${bodyString}`, webhookSecret);

  const signatureMatch = signature.match(/v1=([a-f0-9]+)/i);
  if (!signatureMatch) return false;

  const receivedV1 = signatureMatch[1];
  return expectedHmac === receivedV1;
}

export function hmacSha256ToHex(data: string, key: string): string {
  const crypto = getCrypto();
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}