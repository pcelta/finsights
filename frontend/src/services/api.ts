import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export interface Summary {
  totalExpenses: number;
  transactionCount: number;
  categoryCount: number;
  dateRange: {
    start?: string;
    end?: string;
  };
}

export interface CategoryBreakdown {
  uid: string;
  name: string;
  slug: string;
  total: number;
  count: number;
  percentage: number;
}

export interface Transaction {
  uid: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: 'income' | 'expense' | 'transfer';
  category: {
    uid: string;
    name: string;
    slug: string;
  } | null;
  account: {
    uid: string;
    bsb: string;
    number: string;
    bankName: string;
    name?: string;
  };
}

export const dashboardApi = {
  getSummary: async (startDate?: string, endDate?: string, categoryUid?: string): Promise<Summary> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryUid) params.append('categoryUid', categoryUid);

    const response = await axios.get(`${API_BASE}/dashboard/summary?${params}`);
    return response.data;
  },

  getCategoryBreakdown: async (startDate?: string, endDate?: string, categoryUid?: string): Promise<CategoryBreakdown[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryUid) params.append('categoryUid', categoryUid);

    const response = await axios.get(`${API_BASE}/dashboard/categories?${params}`);
    return response.data;
  },

  getTransactions: async (
    startDate?: string,
    endDate?: string,
    categoryUid?: string
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryUid) params.append('categoryUid', categoryUid);

    const response = await axios.get(`${API_BASE}/dashboard/transactions?${params}`);
    return response.data;
  },
};

export const transactionApi = {
  updateCategory: async (transactionUid: string, categoryUid: string | null): Promise<Transaction> => {
    const response = await axios.patch(`${API_BASE}/transactions/${transactionUid}/category`, {
      categoryUid,
    });
    return response.data;
  },

  updateType: async (transactionUid: string, type: 'income' | 'expense' | 'transfer'): Promise<Transaction> => {
    const response = await axios.patch(`${API_BASE}/transactions/${transactionUid}/type`, {
      type,
    });
    return response.data;
  },
};
