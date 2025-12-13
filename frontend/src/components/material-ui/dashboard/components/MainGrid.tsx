import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Copyright from '../internals/components/Copyright';
import StatCard, { StatCardProps } from './StatCard';
import ChartExpensesPerCategory from './ChartExpensesPerCategory';
import { dashboardApi, Summary, CategoryBreakdown, Transaction } from '../../../../services/api';
import TransactionsList from '../../../TransactionsList';

export default function MainGrid() {
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
      setCategories(allCategoriesData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const statCards: StatCardProps[] = summary ? [
    {
      title: 'Total Expenses',
      value: `$${summary.totalExpenses.toFixed(2)}`,
      interval: startDate || endDate ? `${startDate || 'Start'} - ${endDate || 'End'}` : 'All time',
      trend: 'neutral',
      data: [],
    },
    {
      title: 'Transactions',
      value: summary.transactionCount.toString(),
      interval: startDate || endDate ? `${startDate || 'Start'} - ${endDate || 'End'}` : 'All time',
      trend: 'neutral',
      data: [],
    },
    {
      title: 'Categories',
      value: summary.categoryCount.toString(),
      interval: 'Active categories',
      trend: 'neutral',
      data: [],
    },
  ] : [];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* Filters */}
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

      {/* Summary Cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {statCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Details */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
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
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <ChartExpensesPerCategory categories={categories} />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}