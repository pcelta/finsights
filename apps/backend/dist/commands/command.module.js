"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandModule = void 0;
const common_1 = require("@nestjs/common");
const health_command_1 = require("./health.command");
const parse_transactions_command_1 = require("./parse-transactions.command");
const app_service_1 = require("../app.service");
const parser_module_1 = require("../parsers/parser.module");
const services_module_1 = require("../services/services.module");
let CommandModule = class CommandModule {
};
exports.CommandModule = CommandModule;
exports.CommandModule = CommandModule = __decorate([
    (0, common_1.Module)({
        imports: [parser_module_1.ParserModule, services_module_1.ServicesModule],
        providers: [health_command_1.HealthCommand, parse_transactions_command_1.ParseTransactionsCommand, app_service_1.AppService],
    })
], CommandModule);
//# sourceMappingURL=command.module.js.map