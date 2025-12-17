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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCategoryService = void 0;
const common_1 = require("@nestjs/common");
const ajv_1 = __importDefault(require("ajv"));
const transaction_category_repository_1 = require("../repositories/transaction-category.repository");
let TransactionCategoryService = class TransactionCategoryService {
    transactionCategoryRepository;
    ajv;
    categories;
    constructor(transactionCategoryRepository) {
        this.transactionCategoryRepository = transactionCategoryRepository;
        this.ajv = new ajv_1.default({ strict: false });
    }
    async getCategories() {
        if (this.categories) {
            return this.categories;
        }
        this.categories = await this.transactionCategoryRepository.findAllWithRules();
        return this.categories;
    }
    async findOut(transactionDescription) {
        const categories = await this.getCategories();
        const schemaTemplate = {
            type: "string",
        };
        for (const category of categories ?? []) {
            if (!category.rules) {
                continue;
            }
            let schema = { ...schemaTemplate, ...category.rules };
            try {
                const validate = this.ajv.compile(schema);
                if (validate(transactionDescription.toLowerCase())) {
                    return category;
                }
            }
            catch (error) {
                console.error(`Invalid schema for category ${category.slug}:`, error);
            }
        }
        return this.transactionCategoryRepository.findBySlug('other');
    }
    async findByUid(uid) {
        return this.transactionCategoryRepository.findByUid(uid);
    }
    async findAll() {
        return this.transactionCategoryRepository.findAll();
    }
};
exports.TransactionCategoryService = TransactionCategoryService;
exports.TransactionCategoryService = TransactionCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_category_repository_1.TransactionCategoryRepository])
], TransactionCategoryService);
//# sourceMappingURL=transaction-category.service.js.map