import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL + '/api' || 'http://localhost:3000/api';

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

export interface FinancialInstitution {
  uid: string;
  name: string;
  description?: string;
  isEnabled: boolean;
}

export interface StatementImport {
  uid: string;
  financialInstitution: FinancialInstitution;
  status: 'pending' | 'processing' | 'processed' | 'failed';
  path: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export const importApi = {
  getFinancialInstitutions: async (): Promise<FinancialInstitution[]> => {
    const response = await axios.get(`${API_BASE}/financial-institutions`);
    return response.data;
  },

  uploadStatement: async (file: File, financialInstitutionUid: string): Promise<{ jobId: string; importUid: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('financial_institution_uid', financialInstitutionUid);

    const response = await axios.post(`${API_BASE}/import/statement`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getImportStatus: async (uid: string): Promise<StatementImport> => {
    const response = await axios.get(`${API_BASE}/import/statement/${uid}`);
    return response.data;
  },

  getAllImports: async (): Promise<StatementImport[]> => {
    const response = await axios.get(`${API_BASE}/import`);
    return response.data;
  },
};
