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
exports.CliModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const command_module_1 = require("./commands/command.module");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
let CliModule = class CliModule {
};
exports.CliModule = CliModule;
exports.CliModule = CliModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forRoot(mikro_orm_config_1.default), command_module_1.CommandModule],
    })
], CliModule);
//# sourceMappingURL=cli.module.js.map