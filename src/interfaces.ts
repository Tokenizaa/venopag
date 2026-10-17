export interface WebhookVerificationConfig {
  signature: string;
  timestamp: string;
  body: string | Uint8Array;
  webhookSecret: string;
}

export interface WebhookParseResult {
  timestamp: string;
  v1: string;
}

export interface VenoPagError extends Error {
  errorCode: string;
  rawResponse: any;
}

export enum WebhookEventType {
  CashIn = "cashin",
  CashOut = "cashout",
  EnrollmentGranted = "enrollment.granted",
  EnrollmentRevoked = "enrollment.revoked",
}

export interface WebhookCashInPayload {
  type: "cashin";
  status: string;
  amount: number;
  fee: number;
  request_number: string;
  transaction_id: string;
  e2e: string;
  updated_at: string;
}

export interface WebhookCashOutPayload {
  type: "cashout";
  status: string;
  amount: number;
  fee: number;
  transaction_id: string;
  e2e: string;
  updated_at: string;
}

export interface WebhookEnrollmentGrantedPayload {
  event: "enrollment.granted";
  sent_at: string;
  enrollment_id: number;
  status: string;
  granted_at: string;
  expires_at?: string | null;
  order_id: number;
  reason?: string | null;
  course: {
    id: number;
    title: string;
  };
  student: {
    id: number;
    name: string;
    email: string;
  };
}

export interface WebhookEnrollmentRevokedPayload {
  event: "enrollment.revoked";
  sent_at: string;
  enrollment_id: number;
  status: string;
  granted_at: string;
  expires_at?: string | null;
  order_id: number;
  reason: "manual" | "refund" | "chargeback" | "med";
  course: {
    id: number;
    title: string;
  };
  student: {
    id: number;
    name: string;
    email: string;
  };
}

export enum CashInStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Expired = "expired",
  Canceled = "canceled",
  Contested = "contested",
  ChargedBack = "chargedback",
  Refunded = "refunded",
}

export enum CashOutStatus {
  Pending = "pending",
  Completed = "completed",
  Canceled = "canceled",
}

export interface PaginatedOptions {
  page?: number;
  limit?: number;
}