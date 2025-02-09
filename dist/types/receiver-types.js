"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurposeOfTransactions = exports.SourceOfFundsDocType = exports.AddressDocType = exports.IDDocType = exports.KYCType = exports.ReceiverType = void 0;
// Enums
var ReceiverType;
(function (ReceiverType) {
    ReceiverType["INDIVIDUAL"] = "individual";
    ReceiverType["BUSINESS"] = "business";
})(ReceiverType = exports.ReceiverType || (exports.ReceiverType = {}));
var KYCType;
(function (KYCType) {
    KYCType["LIGHT"] = "light";
    KYCType["STANDARD"] = "standard";
    KYCType["ENHANCED"] = "enhanced";
})(KYCType = exports.KYCType || (exports.KYCType = {}));
var IDDocType;
(function (IDDocType) {
    IDDocType["PASSPORT"] = "PASSPORT";
    IDDocType["ID_CARD"] = "ID_CARD";
    IDDocType["DRIVERS"] = "DRIVERS";
})(IDDocType = exports.IDDocType || (exports.IDDocType = {}));
var AddressDocType;
(function (AddressDocType) {
    AddressDocType["UTILITY_BILL"] = "UTILITY_BILL";
    AddressDocType["BANK_STATEMENT"] = "BANK_STATEMENT";
    AddressDocType["RENTAL_AGREEMENT"] = "RENTAL_AGREEMENT";
    AddressDocType["TAX_DOCUMENT"] = "TAX_DOCUMENT";
    AddressDocType["GOVERNMENT_CORRESPONDENCE"] = "GOVERNMENT_CORRESPONDENCE";
})(AddressDocType = exports.AddressDocType || (exports.AddressDocType = {}));
var SourceOfFundsDocType;
(function (SourceOfFundsDocType) {
    SourceOfFundsDocType["BUSINESS_INCOME"] = "business_income";
    SourceOfFundsDocType["GAMBLING_PROCEEDS"] = "gambling_proceeds";
    SourceOfFundsDocType["GIFTS"] = "gifts";
    SourceOfFundsDocType["GOVERNMENT_BENEFITS"] = "government_benefits";
    SourceOfFundsDocType["INHERITANCE"] = "inheritance";
})(SourceOfFundsDocType = exports.SourceOfFundsDocType || (exports.SourceOfFundsDocType = {}));
var PurposeOfTransactions;
(function (PurposeOfTransactions) {
    PurposeOfTransactions["BUSINESS_TRANSACTIONS"] = "business_transactions";
    PurposeOfTransactions["CHARITABLE_DONATIONS"] = "charitable_donations";
    PurposeOfTransactions["INVESTMENT_PURPOSES"] = "investment_purposes";
    PurposeOfTransactions["PAYMENTS_TO_FRIENDS_OR_FAMILY_ABROAD"] = "payments_to_friends_or_family_abroad";
    PurposeOfTransactions["PERSONAL_OR_LIVING_EXPENSES"] = "personal_or_living_expenses";
    PurposeOfTransactions["PROTECT_WEALTH"] = "protect_wealth";
    PurposeOfTransactions["PURCHASE_GOODS_AND_SERVICES"] = "purchase_goods_and_services";
    PurposeOfTransactions["RECEIVE_PAYMENT_FOR_FREELANCING"] = "receive_payment_for_freelancing";
    PurposeOfTransactions["RECEIVE_SALARY"] = "receive_salary";
    PurposeOfTransactions["OTHER"] = "other";
})(PurposeOfTransactions = exports.PurposeOfTransactions || (exports.PurposeOfTransactions = {}));
