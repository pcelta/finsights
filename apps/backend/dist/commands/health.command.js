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
exports.HealthCommand = void 0;
const nest_commander_1 = require("nest-commander");
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let HealthCommand = class HealthCommand extends nest_commander_1.CommandRunner {
    appService;
    constructor(appService) {
        super();
        this.appService = appService;
    }
    async run() {
        console.log('=== App Information ===');
        console.log(`Message: ${this.appService.getHello()}`);
        console.log(`Version: 0.0.1`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    }
};
exports.HealthCommand = HealthCommand;
exports.HealthCommand = HealthCommand = __decorate([
    (0, common_1.Injectable)(),
    (0, nest_commander_1.Command)({
        name: 'fin:health',
        description: 'Display app information (demonstrates dependency injection)',
    }),
    __metadata("design:paramtypes", [app_service_1.AppService])
], HealthCommand);
//# sourceMappingURL=health.command.js.map