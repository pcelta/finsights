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
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const dashboard_controller_1 = require("./controllers/dashboard.controller");
const transaction_controller_1 = require("./controllers/transaction.controller");
const dashboard_service_1 = require("./services/dashboard.service");
const transaction_service_1 = require("./services/transaction.service");
const transaction_category_service_1 = require("./services/transaction-category.service");
const account_service_1 = require("./services/account.service");
const transaction_repository_1 = require("./repositories/transaction.repository");
const transaction_category_repository_1 = require("./repositories/transaction-category.repository");
const account_repository_1 = require("./repositories/account.repository");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forRoot(mikro_orm_config_1.default)],
        controllers: [app_controller_1.AppController, dashboard_controller_1.DashboardController, transaction_controller_1.TransactionController],
        providers: [
            app_service_1.AppService,
            dashboard_service_1.DashboardService,
            transaction_service_1.TransactionService,
            transaction_category_service_1.TransactionCategoryService,
            account_service_1.AccountService,
            transaction_repository_1.TransactionRepository,
            transaction_category_repository_1.TransactionCategoryRepository,
            account_repository_1.AccountRepository,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map