"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTransactionsCommand = void 0;
const nest_commander_1 = require("nest-commander");
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdfjsLib = __importStar(require("pdfjs-dist/legacy/build/pdf.mjs"));
const transaction_parser_service_1 = require("../services/transaction-parser.service");
const transaction_service_1 = require("../services/transaction.service");
let ParseTransactionsCommand = class ParseTransactionsCommand extends nest_commander_1.CommandRunner {
    transactionParserService;
    transactionService;
    constructor(transactionParserService, transactionService) {
        super();
        this.transactionParserService = transactionParserService;
        this.transactionService = transactionService;
    }
    async run(_passedParams, options) {
        try {
            const fileName = options?.file || '2025-08-29-statement.pdf';
            const bankTypeStr = options?.bank || 'ANZ';
            const bankType = this.validateBankType(bankTypeStr);
            const pdfPath = path.join(process.cwd(), 'src', 'data', fileName);
            if (!fs.existsSync(pdfPath)) {
                console.error(`Error: PDF file not found at ${pdfPath}`);
                return;
            }
            console.log(`Parsing statement from: ${fileName}...`);
            console.log(`Bank: ${bankType}`);
            const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
            const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
            const pdfDocument = await loadingTask.promise;
            const numPages = pdfDocument.numPages;
            let fullText = '';
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item) => item.str)
                    .join(' ');
                fullText += pageText + '\n';
            }
            const statement = this.transactionParserService.parseStatement(fullText, bankType);
            await this.transactionService.ingest(statement);
            console.error(`Account Name: ${statement.account.accountName}`);
            console.error(`BSB: ${statement.account.bsb} | Account: ${statement.account.accountNumber}`);
            console.error(`Period: ${statement.account.statementPeriod}`);
            console.error(`Opening Balance: $${statement.account.openingBalance.toFixed(2)}`);
            console.error(`Closing Balance: $${statement.account.closingBalance.toFixed(2)}`);
            console.error(`Total transactions: ${statement.transactions.length}`);
        }
        catch (error) {
            console.error('Error parsing statement:', error.message);
            if (error.stack) {
                console.error(error.stack);
            }
        }
    }
    validateBankType(bankTypeStr) {
        const upperBankType = bankTypeStr.toUpperCase();
        if (!Object.values(transaction_parser_service_1.BankType).includes(upperBankType)) {
            const supportedBanks = this.transactionParserService.getSupportedBanks().join(', ');
            throw new Error(`Unsupported bank type: "${bankTypeStr}". Supported banks: ${supportedBanks}`);
        }
        return upperBankType;
    }
    parseFile(val) {
        return val;
    }
    parseBank(val) {
        return val;
    }
};
exports.ParseTransactionsCommand = ParseTransactionsCommand;
__decorate([
    (0, nest_commander_1.Option)({
        flags: '-f, --file <filename>',
        description: 'PDF filename in src/data directory (default: 2025-08-29-statement.pdf)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], ParseTransactionsCommand.prototype, "parseFile", null);
__decorate([
    (0, nest_commander_1.Option)({
        flags: '-b, --bank <type>',
        description: 'Bank type: ANZ (default: ANZ)',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], ParseTransactionsCommand.prototype, "parseBank", null);
exports.ParseTransactionsCommand = ParseTransactionsCommand = __decorate([
    (0, common_1.Injectable)(),
    (0, nest_commander_1.Command)({
        name: 'fin:parse',
        description: 'Parse PDF bank statement and extract account details and transactions',
    }),
    __metadata("design:paramtypes", [transaction_parser_service_1.TransactionParserService,
        transaction_service_1.TransactionService])
], ParseTransactionsCommand);
//# sourceMappingURL=parse-transactions.command.js.map