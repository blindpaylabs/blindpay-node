"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchCopDocumentType = exports.TransfersType = exports.SpeiProtocol = exports.AccountType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["CHECKING"] = "checking";
    AccountType["SAVING"] = "saving";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var SpeiProtocol;
(function (SpeiProtocol) {
    SpeiProtocol["CLABE"] = "clabe";
    SpeiProtocol["DEBITCARD"] = "debitcard";
    SpeiProtocol["PHONENUM"] = "phonenum";
})(SpeiProtocol = exports.SpeiProtocol || (exports.SpeiProtocol = {}));
var TransfersType;
(function (TransfersType) {
    TransfersType["CVU"] = "CVU";
    TransfersType["CBU"] = "CBU";
    TransfersType["ALIAS"] = "ALIAS";
})(TransfersType = exports.TransfersType || (exports.TransfersType = {}));
var AchCopDocumentType;
(function (AchCopDocumentType) {
    AchCopDocumentType["CC"] = "CC";
    AchCopDocumentType["CE"] = "CE";
    AchCopDocumentType["NIT"] = "NIT";
    AchCopDocumentType["PASS"] = "PASS";
    AchCopDocumentType["PEP"] = "PEP";
})(AchCopDocumentType = exports.AchCopDocumentType || (exports.AchCopDocumentType = {}));
