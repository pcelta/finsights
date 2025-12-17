import { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { importApi, FinancialInstitution } from '../services/api';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export default function UploadDialog({
  open,
  onClose,
  onUploadComplete,
}: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [financialInstitutionUid, setFinancialInstitutionUid] = useState('');
  const [institutions, setInstitutions] = useState<FinancialInstitution[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInstitutions, setLoadingInstitutions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchInstitutions();
    }
  }, [open]);

  const fetchInstitutions = async () => {
    try {
      setLoadingInstitutions(true);
      const data = await importApi.getFinancialInstitutions();
      setInstitutions(data.filter((inst) => inst.isEnabled));
      setError(null);
    } catch (err) {
      console.error('Error fetching institutions:', err);
      setError('Failed to load financial institutions');
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || !financialInstitutionUid) {
      setError('Please select both a file and a financial institution');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await importApi.uploadStatement(file, financialInstitutionUid);
      handleClose();
      onUploadComplete();
    } catch (err) {
      console.error('Error uploading statement:', err);
      setError('Failed to upload statement. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setFinancialInstitutionUid('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Bank Statement</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loadingInstitutions ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              select
              label="Financial Institution"
              value={financialInstitutionUid}
              onChange={(e) => setFinancialInstitutionUid(e.target.value)}
              fullWidth
              disabled={loading}
              required
            >
              {institutions.map((institution) => (
                <MenuItem key={institution.uid} value={institution.uid}>
                  {institution.name}
                  {institution.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      - {institution.description}
                    </Typography>
                  )}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
                disabled={loading}
              >
                {file ? file.name : 'Choose File'}
                <input
                  type="file"
                  accept=".csv,.pdf"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Supported formats: CSV, PDF
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !file || !financialInstitutionUid || loadingInstitutions}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
