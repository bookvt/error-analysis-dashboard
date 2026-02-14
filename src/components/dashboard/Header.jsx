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
            bgcolor: 'rgba(30, 41, 59, 0.4)', // slate-800/40
            backdropFilter: 'blur(12px)',
            borderRadius: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', xl: 'row' },
            alignItems: { xl: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <Typography variant="h4" component="h1" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <Activity size={32} className="text-blue-400" style={{ stroke: '#60a5fa' }} />
          Machine Error Analysis Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.secondary', fontWeight: 'medium' }}>
            Upload Error Log & Machine Mapping to visualize insights
        </Typography>
      </Box>
      
      <Stack direction="row" spacing={2} flexWrap="wrap">
         {isDataLoaded && (
            <Button
                variant="contained"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPdf}
                startIcon={isGeneratingPdf ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.05)', 
                    color: 'white',
                    border: '1px solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(4px)',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1,
                    px: 3,
                    borderRadius: 2,
                    '&:hover': { 
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    } 
                }}
            >
                {isGeneratingPdf ? 'Generating PDF...' : 'Export PDF'}
            </Button>
         )}
         
         <Button
            component="label"
            variant="contained"
            startIcon={<Upload size={20} />}
            sx={{
                background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1,
                px: 3,
                borderRadius: 2,
                '&:hover': {
                    background: 'linear-gradient(to right, #2563eb, #0891b2)',
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                }
            }}
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
            variant="outlined"
            startIcon={<FileSpreadsheet size={20} />}
            sx={{
                color: '#34d399',
                borderColor: 'rgba(52, 211, 153, 0.3)',
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1,
                px: 3,
                borderRadius: 2,
                '&:hover': {
                    borderColor: '#34d399',
                    bgcolor: 'rgba(52, 211, 153, 0.05)'
                }
            }}
         >
            Mapping
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
