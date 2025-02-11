"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.CurrencyType = void 0;
var CurrencyType;
(function (CurrencyType) {
    CurrencyType["Sender"] = "sender";
    CurrencyType["Receiver"] = "receiver";
})(CurrencyType = exports.CurrencyType || (exports.CurrencyType = {}));
var Token;
(function (Token) {
    Token["USDC"] = "USDC";
    Token["USDT"] = "USDT";
    Token["USDB"] = "USDB";
    Token["USDX"] = "USDX";
    Token["BRL"] = "BRL";
    Token["USD"] = "USD";
    Token["MXN"] = "MXN";
    Token["COP"] = "COP";
    Token["ARS"] = "ARS";
})(Token = exports.Token || (exports.Token = {}));
