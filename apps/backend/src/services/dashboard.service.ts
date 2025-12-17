import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly em: EntityManager) {}

  async getSummary(startDate?: string, endDate?: string, categoryUid?: string) {
    const em = this.em.fork();

    const where: any = {
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

    const transactions = await em.find(Transaction, where, {
      populate: ['category'],
    });

    // Calculate expenses (positive amounts)
    const totalExpenses = transactions
      .filter(t => Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const transactionCount = transactions.length;

    // Get unique categories from filtered transactions
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

  async getCategoryBreakdown(startDate?: string, endDate?: string, categoryUid?: string) {
    const em = this.em.fork();

    const where: any = {
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

    const transactions = await em.find(Transaction, where, {
      populate: ['category'],
    });

    // Group by category
    const categoryMap = new Map<string, { uid: string; name: string; slug: string; total: number; count: number }>();

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

      const category = categoryMap.get(categoryUid)!;
      category.total += Number(t.amount);
      category.count += 1;
    });

    const results = Array.from(categoryMap.values());

    // Calculate total for percentage
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

  async getTransactions(
    startDate?: string,
    endDate?: string,
    categoryUid?: string,
  ) {
    const em = this.em.fork();

    const where: any = {
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

    const transactions = await em.find(Transaction, where, {
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
}
