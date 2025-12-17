"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionParserService = exports.BankType = void 0;
const common_1 = require("@nestjs/common");
const anz_parser_1 = require("../parsers/anz.parser");
var BankType;
(function (BankType) {
    BankType["ANZ"] = "ANZ";
})(BankType || (exports.BankType = BankType = {}));
let TransactionParserService = class TransactionParserService {
    anzParser;
    parsers;
    constructor(anzParser) {
        this.anzParser = anzParser;
        this.parsers = new Map([
            [BankType.ANZ, this.anzParser],
        ]);
    }
    parseStatement(text, bankType) {
        const parser = this.getParser(bankType);
        return parser.parseStatement(text);
    }
    getParser(bankType) {
        const parser = this.parsers.get(bankType);
        if (!parser) {
            throw new Error(`Parser for bank type "${bankType}" is not implemented. Available parsers: ${Array.from(this.parsers.keys()).join(', ')}`);
        }
        return parser;
    }
    getSupportedBanks() {
        return Array.from(this.parsers.keys());
    }
};
exports.TransactionParserService = TransactionParserService;
exports.TransactionParserService = TransactionParserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [anz_parser_1.ANZParser])
], TransactionParserService);
//# sourceMappingURL=transaction-parser.service.js.map