import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly em: EntityManager) {}

  async getSummary(startDate?: string, endDate?: string, categoryId?: number) {
    const em = this.em.fork();

    const where: any = {};
    if (startDate) {
      where.transactionDate = { ...where.transactionDate, $gte: new Date(startDate) };
    }
    if (endDate) {
      where.transactionDate = { ...where.transactionDate, $lte: new Date(endDate) };
    }
    if (categoryId) {
      where.category = categoryId;
    }

    const transactions = await em.find(Transaction, where, {
      populate: ['category'],
    });

    // Calculate income (negative amounts) and expenses (positive amounts)
    const totalIncome = transactions
      .filter(t => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const totalExpenses = transactions
      .filter(t => Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const transactionCount = transactions.length;

    // Get unique categories from filtered transactions
    const uniqueCategoryIds = new Set(transactions.map(t => t.category?.id).filter(id => id !== undefined));

    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount,
      categoryCount: uniqueCategoryIds.size,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };
  }

  async getCategoryBreakdown(startDate?: string, endDate?: string, categoryId?: number) {
    const em = this.em.fork();

    const where: any = {};
    if (startDate) {
      where.transactionDate = { ...where.transactionDate, $gte: new Date(startDate) };
    }
    if (endDate) {
      where.transactionDate = { ...where.transactionDate, $lte: new Date(endDate) };
    }
    if (categoryId) {
      where.category = categoryId;
    }

    const transactions = await em.find(Transaction, where, {
      populate: ['category'],
    });

    // Group by category
    const categoryMap = new Map<number, { id: number; name: string; slug: string; total: number; count: number }>();

    transactions.forEach((t) => {
      const categoryId = t.category?.id || 0;
      const categoryName = t.category?.name || 'Uncategorized';
      const categorySlug = t.category?.slug || 'uncategorized';

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: categoryName,
          slug: categorySlug,
          total: 0,
          count: 0,
        });
      }

      const category = categoryMap.get(categoryId)!;
      category.total += Number(t.amount);
      category.count += 1;
    });

    const results = Array.from(categoryMap.values());

    // Calculate total for percentage
    const total = results.reduce((sum, r) => sum + r.total, 0);

    return results.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      total: r.total,
      count: r.count,
      percentage: total > 0 ? (r.total / total) * 100 : 0,
    }));
  }

  async getTransactions(
    startDate?: string,
    endDate?: string,
    categoryId?: number,
  ) {
    const em = this.em.fork();

    const where: any = {};
    if (startDate) {
      where.transactionDate = { ...where.transactionDate, $gte: new Date(startDate) };
    }
    if (endDate) {
      where.transactionDate = { ...where.transactionDate, $lte: new Date(endDate) };
    }
    if (categoryId) {
      where.category = categoryId;
    }

    const transactions = await em.find(Transaction, where, {
      populate: ['category', 'account'],
      orderBy: { transactionDate: 'DESC' },
    });

    return transactions.map((t) => ({
      id: t.id,
      date: t.transactionDate,
      description: t.description,
      amount: Number(t.amount),
      balance: Number(t.balance),
      type: t.type,
      category: t.category
        ? {
            id: t.category.id,
            name: t.category.name,
            slug: t.category.slug,
          }
        : null,
      account: {
        bsb: t.account.bsb,
        number: t.account.number,
        bankName: t.account.bankName,
        name: t.account.name,
      },
    }));
  }
}
