import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface Summary {
  totalSpent: number;
  transactionCount: number;
  categoryCount: number;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface CategoryBreakdown {
  id: number;
  name: string;
  slug: string;
  total: number;
  count: number;
  percentage: number;
}

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  balance: number;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  account: {
    bsb: string;
    number: string;
    bankName: string;
  };
}

export const dashboardApi = {
  getSummary: async (startDate?: string, endDate?: string, categoryId?: number): Promise<Summary> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryId) params.append('categoryId', categoryId.toString());

    const response = await axios.get(`${API_BASE}/dashboard/summary?${params}`);
    return response.data;
  },

  getCategoryBreakdown: async (startDate?: string, endDate?: string, categoryId?: number): Promise<CategoryBreakdown[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryId) params.append('categoryId', categoryId.toString());

    const response = await axios.get(`${API_BASE}/dashboard/categories?${params}`);
    return response.data;
  },

  getTransactions: async (
    startDate?: string,
    endDate?: string,
    categoryId?: number
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryId) params.append('categoryId', categoryId.toString());

    const response = await axios.get(`${API_BASE}/dashboard/transactions?${params}`);
    return response.data;
  },
};
