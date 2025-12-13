import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import CategoryIcon from '@mui/icons-material/Category';
import { CategoryBreakdown } from '../../../../services/api';

interface StyledTextProps {
  variant: 'primary' | 'secondary';
}

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<StyledTextProps>(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

interface CategoryChartProps {
  categories: CategoryBreakdown[];
}

export default function ChartUserByCountry({ categories }: CategoryChartProps) {
  const totalAmount = categories.reduce((sum, cat) => sum + cat.total, 0);
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  // Prepare data for pie chart - show top 5 categories
  const topCategories = [...categories]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const data = topCategories.map(cat => ({
    label: cat.name,
    value: cat.total,
  }));

  // Generate colors dynamically
  const colors = topCategories.map((_, index) =>
    `hsl(${220 - index * 15}, ${50 + index * 5}%, ${40 + index * 8}%)`
  );

  const categoryBreakdown = topCategories.map((cat, index) => ({
    name: cat.name,
    value: cat.percentage,
    amount: cat.total,
    count: cat.count,
    color: colors[index],
  }));

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Top Categories
        </Typography>
        {categories.length > 0 ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PieChart
                colors={colors}
                margin={{
                  left: 80,
                  right: 80,
                  top: 80,
                  bottom: 80,
                }}
                series={[
                  {
                    data,
                    innerRadius: 75,
                    outerRadius: 100,
                    paddingAngle: 0,
                    highlightScope: { fade: 'global', highlight: 'item' },
                  },
                ]}
                height={260}
                width={260}
                hideLegend
              >
                <PieCenterLabel
                  primaryText={totalCount.toString()}
                  secondaryText="Transactions"
                />
              </PieChart>
            </Box>
            {categoryBreakdown.map((category, index) => (
              <Stack
                key={index}
                direction="row"
                sx={{ alignItems: 'center', gap: 2, pb: 2 }}
              >
                <CategoryIcon sx={{ color: category.color }} />
                <Stack sx={{ gap: 1, flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: '500' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {category.value.toFixed(1)}% (${category.amount.toFixed(2)})
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    aria-label={`${category.name} percentage`}
                    value={category.value}
                    sx={{
                      [`& .${linearProgressClasses.bar}`]: {
                        backgroundColor: category.color,
                      },
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">No categories</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
