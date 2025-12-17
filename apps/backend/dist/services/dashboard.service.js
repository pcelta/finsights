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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const transaction_entity_1 = require("../entities/transaction.entity");
let DashboardService = class DashboardService {
    em;
    constructor(em) {
        this.em = em;
    }
    async getSummary(startDate, endDate, categoryUid) {
        const em = this.em.fork();
        const where = {
            type: { $ne: 'transfer' },
        };
        if (startDate) {
            where.transactionDate = { ...where.transactionDate, $gte: new Date(startDate) };
        }
        if (endDate) {
            where.transactionDate = { ...where.transactionDate, $lte: new Date(endDate) };
        }
        if (categoryUid) {
            where.category = { uid: categoryUid };
        }
        const transactions = await em.find(transaction_entity_1.Transaction, where, {
            populate: ['category'],
        });
        const totalExpenses = transactions
            .filter(t => Number(t.amount) > 0)
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const transactionCount = transactions.length;
        const uniqueCategoryUids = new Set(transactions.map(t => t.category?.uid).filter(uid => uid !== undefined));
        return {
            totalExpenses,
            transactionCount,
            categoryCount: uniqueCategoryUids.size,
            dateRange: {
                start: startDate,
                end: endDate,
            },
        };
    }
    async getCategoryBreakdown(startDate, endDate, categoryUid) {
        const em = this.em.fork();
        const where = {
            type: { $ne: 'transfer' },
        };
        if (startDate) {
            where.transactionDate = { ...where.transactionDate, $gte: new Date(startDate) };
        }
        if (endDate) {
            where.transactionDate = { ...where.transactionDate, $lte: new Date(endDate) };
        }
        if (categoryUid) {
            where.category = { uid: categoryUid };
        }
        const transactions = await em.find(transaction_entity_1.Transaction, where, {
            populate: ['category'],
        });
        const categoryMap = new Map();
        transactions.forEach((t) => {
            const categoryUid = t.category?.uid || 'uncategorized';
            const categoryName = t.category?.name || 'Uncategorized';
            const categorySlug = t.category?.slug || 'uncategorized';
            if (!categoryMap.has(categoryUid)) {
                categoryMap.set(categoryUid, {
                    uid: categoryUid,
                    name: categoryName,
                    slug: categorySlug,
                    total: 0,
                    count: 0,
                });
            }
            const category = categoryMap.get(categoryUid);
            category.total += Number(t.amount);
            category.count += 1;
        });
        const results = Array.from(categoryMap.values());
        const total = results.reduce((sum, r) => sum + r.total, 0);
        return results.map((r) => ({
            uid: r.uid,
            name: r.name,
            slug: r.slug,
            total: r.total,
            count: r.count,
            percentage: total > 0 ? (r.total / total) * 100 : 0,
        }));
    }
    async getTransactions(startDate, endDate, categoryUid) {
        const em = this.em.fork();
        const where = {
            type: { $ne: 'transfer' },
        };
        if (startDate) {
            where.transactionDate = { ...where.transactionDate, $gte: new Date(startDate) };
        }
        if (endDate) {
            where.transactionDate = { ...where.transactionDate, $lte: new Date(endDate) };
        }
        if (categoryUid) {
            where.category = { uid: categoryUid };
        }
        const transactions = await em.find(transaction_entity_1.Transaction, where, {
            populate: ['category', 'account'],
            orderBy: { transactionDate: 'DESC' },
        });
        return transactions.map((t) => ({
            uid: t.uid,
            date: t.transactionDate,
            description: t.description,
            amount: Number(t.amount),
            balance: Number(t.balance),
            type: t.type,
            category: t.category
                ? {
                    uid: t.category.uid,
                    name: t.category.name,
                    slug: t.category.slug,
                }
                : null,
            account: {
                uid: t.account.uid,
                bsb: t.account.bsb,
                number: t.account.number,
                bankName: t.account.bankName,
                name: t.account.name,
            },
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map