import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CategoryBreakdown } from '../services/api';
import { Box, Typography } from '@mui/material';

interface CategoryChartProps {
  categories: CategoryBreakdown[];
}

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#FF6384',
  '#C9CBCF',
];

const CategoryChart: React.FC<CategoryChartProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="textSecondary">No data available</Typography>
      </Box>
    );
  }

  const data = categories.map((cat) => ({
    name: cat.name,
    amount: cat.total,
    percentage: cat.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <Typography variant="body2">
            <strong>{payload[0].payload.name}</strong>
          </Typography>
          <Typography variant="body2" color="primary">
            ${payload[0].value.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {payload[0].payload.percentage.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
        />
        <YAxis
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
