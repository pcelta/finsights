import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { dashboardApi, Summary, CategoryBreakdown, Transaction } from '../services/api';
import CategoryChart from './CategoryChart';
import TransactionsList from './TransactionsList';

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCategoryUid, setSelectedCategoryUid] = useState<string>('');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const categoryUid = selectedCategoryUid === '' ? undefined : selectedCategoryUid;

      const [summaryData, allCategoriesData, transactionsData] = await Promise.all([
        dashboardApi.getSummary(startDate, endDate, categoryUid),
        dashboardApi.getCategoryBreakdown(startDate, endDate),
        dashboardApi.getTransactions(startDate, endDate, categoryUid),
      ]);

      setSummary(summaryData);
      setCategories(allCategoriesData); // For chart - show all categories
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data. Please ensure the backend API is running on http://localhost:3000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategoryUid('');
  };

  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((t) =>
        t.uid === updatedTransaction.uid ? updatedTransaction : t
      )
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Financial Insights Dashboard
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 150 }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 150 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryUid}
              label="Category"
              onChange={(e) => setSelectedCategoryUid(e.target.value as string)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.uid} value={cat.uid}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={loadData} disabled={loading}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear
          </Button>
        </Box>
      </Paper>

      {summary && (
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 250px' }}>
            <Card sx={{ bgcolor: 'error.light' }}>
              <CardContent>
                <Typography color="error.contrastText" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h4" component="div" color="error.contrastText">
                  ${summary.totalExpenses.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 250px' }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Transactions
                </Typography>
                <Typography variant="h4" component="div">
                  {summary.transactionCount}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 400px', minWidth: 0 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <CategoryChart categories={categories} />
          </Paper>
        </Box>

        <Box sx={{ flex: '1.4 1 500px', minWidth: 0 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TransactionsList
              transactions={transactions}
              categories={categories}
              onTransactionUpdate={handleTransactionUpdate}
            />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
