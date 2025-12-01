import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
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
    value: cat.total,
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
            <strong>{payload[0].name}</strong>
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

  const renderLabel = (entry: any) => {
    return `${entry.name} (${entry.percentage.toFixed(1)}%)`;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
