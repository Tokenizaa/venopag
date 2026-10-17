"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashOutStatus = exports.CashInStatus = exports.WebhookEventType = void 0;
var WebhookEventType;
(function (WebhookEventType) {
    WebhookEventType["CashIn"] = "cashin";
    WebhookEventType["CashOut"] = "cashout";
    WebhookEventType["EnrollmentGranted"] = "enrollment.granted";
    WebhookEventType["EnrollmentRevoked"] = "enrollment.revoked";
})(WebhookEventType || (exports.WebhookEventType = WebhookEventType = {}));
var CashInStatus;
(function (CashInStatus) {
    CashInStatus["Pending"] = "pending";
    CashInStatus["Confirmed"] = "confirmed";
    CashInStatus["Expired"] = "expired";
    CashInStatus["Canceled"] = "canceled";
    CashInStatus["Contested"] = "contested";
    CashInStatus["ChargedBack"] = "chargedback";
    CashInStatus["Refunded"] = "refunded";
})(CashInStatus || (exports.CashInStatus = CashInStatus = {}));
var CashOutStatus;
(function (CashOutStatus) {
    CashOutStatus["Pending"] = "pending";
    CashOutStatus["Completed"] = "completed";
    CashOutStatus["Canceled"] = "canceled";
})(CashOutStatus || (exports.CashOutStatus = CashOutStatus = {}));
