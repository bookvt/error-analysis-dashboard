import React from 'react';
import { Activity, Download, Loader2, Upload, FileSpreadsheet } from 'lucide-react';
import { Box, Button, Typography, Paper, Stack } from '@mui/material';

const Header = ({ 
  isDataLoaded, 
  handleDownloadPDF, 
  isGeneratingPdf, 
  handleFileUpload, 
  handleMappingUpload,
  getFormattedDate
}) => {
  return (
    <Paper 
        elevation={0}
        sx={{ 
            p: 3, 
            bgcolor: 'background.paper', 
            borderRadius: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', xl: 'row' },
            alignItems: { xl: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            border: 1,
            borderColor: 'divider'
        }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <Typography variant="h5" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
          <Activity size={28} className="text-blue-500" />
          Machine Error Analysis Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload Error Log & Machine Mapping to visualize
        </Typography>
      </Box>
      
      <Stack direction="row" spacing={2} flexWrap="wrap">
         {isDataLoaded && (
            <Button
                variant="contained"
                color="inherit"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                startIcon={isGeneratingPdf ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                sx={{ bgcolor: 'rgba(51, 65, 85, 0.5)', '&:hover': { bgcolor: 'rgba(51, 65, 85, 0.7)' } }}
            >
                {isGeneratingPdf ? 'Generating...' : 'PDF'}
            </Button>
         )}
         
         <Button
            component="label"
            variant="contained"
            color="primary"
            startIcon={<Upload size={18} />}
         >
            Upload CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              hidden
            />
         </Button>

         <Button
            component="label"
            variant="contained"
            color="success"
            startIcon={<FileSpreadsheet size={18} />}
            sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }} // emerald-600 to emerald-700
         >
            Import Machine Names
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleMappingUpload}
              hidden
            />
         </Button>
      </Stack>
    </Paper>
  );
};

export default Header;
