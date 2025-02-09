"use strict";
exports.__esModule = true;
exports.PayoutType = exports.Network = exports.PayoutStatus = void 0;
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["Processing"] = "processing";
    PayoutStatus["Failed"] = "failed";
    PayoutStatus["Refunded"] = "refunded";
    PayoutStatus["Completed"] = "completed";
})(PayoutStatus = exports.PayoutStatus || (exports.PayoutStatus = {}));
var Network;
(function (Network) {
    Network["Sepolia"] = "sepolia";
    Network["Base"] = "base";
    Network["ArbitrumSepolia"] = "arbitrum_sepolia";
    Network["BaseSepolia"] = "base_sepolia";
    Network["Arbitrum"] = "arbitrum";
    Network["Polygon"] = "polygon";
    Network["PolygonAmoy"] = "polygon_amoy";
})(Network = exports.Network || (exports.Network = {}));
var PayoutType;
(function (PayoutType) {
    PayoutType["Wire"] = "wire";
    PayoutType["ACH"] = "ach";
    PayoutType["PIX"] = "pix";
    PayoutType["SpeiBitso"] = "spei_bitso";
    PayoutType["TransfersBitso"] = "transfers_bitso";
    PayoutType["AchCopBitso"] = "ach_cop_bitso";
})(PayoutType = exports.PayoutType || (exports.PayoutType = {}));
