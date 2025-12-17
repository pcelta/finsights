"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const dashboard_controller_1 = require("./controllers/dashboard.controller");
const transaction_controller_1 = require("./controllers/transaction.controller");
const import_controller_1 = require("./controllers/import.controller");
const financial_institution_controller_1 = require("./controllers/financial-institution.controller");
const dashboard_service_1 = require("./services/dashboard.service");
const transaction_service_1 = require("./services/transaction.service");
const transaction_category_service_1 = require("./services/transaction-category.service");
const account_service_1 = require("./services/account.service");
const financial_institution_service_1 = require("./services/financial-institution.service");
const statement_import_service_1 = require("./services/statement-import.service");
const transaction_repository_1 = require("./repositories/transaction.repository");
const transaction_category_repository_1 = require("./repositories/transaction-category.repository");
const account_repository_1 = require("./repositories/account.repository");
const financial_institution_repository_1 = require("./repositories/financial-institution.repository");
const statement_import_repository_1 = require("./repositories/statement-import.repository");
const queue_module_1 = require("./queue/queue.module");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.MikroOrmModule.forRoot(mikro_orm_config_1.default),
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.diskStorage)({
                    destination: './uploads',
                    filename: (_req, file, cb) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
                    },
                }),
            }),
            queue_module_1.QueueModule,
        ],
        controllers: [
            app_controller_1.AppController,
            dashboard_controller_1.DashboardController,
            transaction_controller_1.TransactionController,
            import_controller_1.ImportController,
            financial_institution_controller_1.FinancialInstitutionController,
        ],
        providers: [
            app_service_1.AppService,
            dashboard_service_1.DashboardService,
            transaction_service_1.TransactionService,
            transaction_category_service_1.TransactionCategoryService,
            account_service_1.AccountService,
            financial_institution_service_1.FinancialInstitutionService,
            statement_import_service_1.StatementImportService,
            transaction_repository_1.TransactionRepository,
            transaction_category_repository_1.TransactionCategoryRepository,
            account_repository_1.AccountRepository,
            financial_institution_repository_1.FinancialInstitutionRepository,
            statement_import_repository_1.StatementImportRepository,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map