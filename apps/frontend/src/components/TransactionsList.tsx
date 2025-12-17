import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Transaction, CategoryBreakdown, transactionApi } from '../services/api';
import { format } from 'date-fns';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: CategoryBreakdown[];
  onTransactionUpdate?: (updatedTransaction: Transaction) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  categories,
  onTransactionUpdate
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [selectedCategoryUid, setSelectedCategoryUid] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'income' | 'expense' | 'transfer'>('expense');
  const [updating, setUpdating] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeCategoryClick = () => {
    if (selectedTransaction) {
      setSelectedCategoryUid(selectedTransaction.category?.uid || '');
      setDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleChangeTypeClick = () => {
    if (selectedTransaction) {
      setSelectedType(selectedTransaction.type);
      setTypeDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTransaction(null);
    setSelectedCategoryUid('');
  };

  const handleTypeDialogClose = () => {
    setTypeDialogOpen(false);
    setSelectedTransaction(null);
    setSelectedType('expense');
  };

  const handleSaveCategory = async () => {
    if (!selectedTransaction) return;

    setUpdating(true);
    try {
      const updatedTransaction = await transactionApi.updateCategory(
        selectedTransaction.uid,
        selectedCategoryUid === '' ? null : selectedCategoryUid
      );
      if (onTransactionUpdate) {
        onTransactionUpdate(updatedTransaction);
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveType = async () => {
    if (!selectedTransaction) return;

    setUpdating(true);
    try {
      const updatedTransaction = await transactionApi.updateType(
        selectedTransaction.uid,
        selectedType
      );
      if (onTransactionUpdate) {
        onTransactionUpdate(updatedTransaction);
      }
      handleTypeDialogClose();
    } catch (error) {
      console.error('Error updating type:', error);
      alert('Failed to update type. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (!transactions || transactions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">No transactions found</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.uid} hover>
                <TableCell>
                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {transaction.account.name || transaction.account.bankName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.category?.name || 'Uncategorized'}
                    size="small"
                    color={transaction.category ? 'primary' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    size="small"
                    color={
                      transaction.type === 'income' ? 'success' :
                      transaction.type === 'expense' ? 'error' :
                      'info'
                    }
                    variant="filled"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: transaction.amount > 0 ? 'error.main' : 'success.main',
                    }}
                  >
                    ${transaction.amount.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, transaction)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleChangeCategoryClick}>Change Category</MenuItem>
        <MenuItem onClick={handleChangeTypeClick}>Change Type</MenuItem>
      </Menu>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Category</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategoryUid}
                label="Category"
                onChange={(e) => setSelectedCategoryUid(e.target.value)}
                disabled={updating}
              >
                <MenuItem value="">
                  <em>Uncategorized</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.uid} value={cat.uid}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={typeDialogOpen} onClose={handleTypeDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Type</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                label="Type"
                onChange={(e) => setSelectedType(e.target.value as 'income' | 'expense' | 'transfer')}
                disabled={updating}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="transfer">Transfer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTypeDialogClose} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveType}
            variant="contained"
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionsList;
