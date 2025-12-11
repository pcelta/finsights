import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { Transaction } from '../services/api';
import { format } from 'date-fns';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">No transactions found</Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: 500 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Account</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Amount</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsList;
