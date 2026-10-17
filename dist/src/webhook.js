"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmacSha256 = hmacSha256;
exports.parseWebhookSignature = parseWebhookSignature;
exports.verifyWebhookSignature = verifyWebhookSignature;
function hmacSha256(data, key) {
    const crypto = require("crypto");
    return crypto.createHmac("sha256", key).update(data).digest("hex");
}
function parseWebhookSignature(signature) {
    const match = signature.match(/t=(\d+),v1=([a-f0-9]+)/i);
    if (!match)
        return null;
    return {
        timestamp: match[1],
        v1: match[2],
    };
}
function verifyWebhookSignature(signature, timestamp, body, webhookSecret) {
    const t = timestamp;
    const bodyString = typeof body === "string" ? body : body.toString("utf8");
    const expectedHmac = hmacSha256(`${t}.${bodyString}`, webhookSecret);
    const signatureMatch = signature.match(/v1=([a-f0-9]+)/i);
    if (!signatureMatch)
        return false;
    const receivedV1 = signatureMatch[1];
    return expectedHmac === receivedV1;
}
