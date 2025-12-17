import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { importApi, StatementImport, FinancialInstitution } from '../../services/api';
import UploadDialog from '../../components/UploadDialog';

export default function ImportsPage() {
  const [imports, setImports] = useState<StatementImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const fetchImports = async () => {
    try {
      const data = await importApi.getAllImports();
      setImports(data);
      setError(null);
    } catch (err) {
      if (err.status !== 404) {
        console.error('Error fetching imports:', err.status);
        setError('Failed to load imports');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImports();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchImports, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUploadComplete = () => {
    setUploadDialogOpen(false);
    fetchImports();
  };

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 200,
      valueFormatter: (value) => {
        return new Date(value).toLocaleString();
      },
    },
    {
      field: 'financialInstitution',
      headerName: 'Institution',
      width: 250,
      valueGetter: (value: FinancialInstitution) => value.name,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const status = params.value as string;
        let color: 'default' | 'primary' | 'success' | 'error' = 'default';

        if (status === 'processing') {
          color = 'primary'
        } else if (status === 'processed') {
          color = 'success';
        } else if (status === 'failed') {
          color = 'error';
        }

        return (
          <Chip
            label={status}
            size="small"
            color={color}
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'error',
      headerName: 'Error',
      width: 400,
      flex: 1,
      valueGetter: (value) => value || '',
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Statement Imports
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          New Import
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {imports.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 400,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No imports yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload your first bank statement to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Statement
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', height: 600 }}>
          <DataGrid
            rows={imports}
            columns={columns}
            getRowId={(row) => row.uid}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
          />
        </Paper>
      )}

      <UploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </Box>
  );
}
